import { NextRequest } from 'next/server'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

// Create a tiny limiter for tests: 3 points per 60 seconds
function makeLimiter(points = 3): RateLimiterMemory {
  return new RateLimiterMemory({ points, duration: 60 })
}

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost/api/test', {
    method: 'GET',
    headers,
  })
}

describe('checkRateLimit', () => {
  it('returns null on first call (under limit)', async () => {
    const limiter = makeLimiter(3)
    const result = await checkRateLimit('user-1', limiter)
    expect(result).toBeNull()
  })

  it('returns null on Nth call within limit', async () => {
    const limiter = makeLimiter(3)
    await checkRateLimit('user-2', limiter)
    await checkRateLimit('user-2', limiter)
    const result = await checkRateLimit('user-2', limiter)
    expect(result).toBeNull()
  })

  it('returns NextResponse with status 429 when limit exceeded', async () => {
    const limiter = makeLimiter(2)
    await checkRateLimit('user-3', limiter)
    await checkRateLimit('user-3', limiter)
    const result = await checkRateLimit('user-3', limiter)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(429)
  })

  it('429 response body contains error message', async () => {
    const limiter = makeLimiter(1)
    await checkRateLimit('user-4', limiter)
    const result = await checkRateLimit('user-4', limiter)
    expect(result).not.toBeNull()
    const body = (await result!.json()) as { error: string }
    expect(body.error).toBe('Too many requests')
  })

  it('429 response includes Retry-After header', async () => {
    const limiter = makeLimiter(1)
    await checkRateLimit('user-5', limiter)
    const result = await checkRateLimit('user-5', limiter)
    expect(result).not.toBeNull()
    const retryAfter = result!.headers.get('Retry-After')
    expect(retryAfter).not.toBeNull()
  })

  it('Retry-After value is a positive integer (seconds)', async () => {
    const limiter = makeLimiter(1)
    await checkRateLimit('user-6', limiter)
    const result = await checkRateLimit('user-6', limiter)
    expect(result).not.toBeNull()
    const retryAfter = parseInt(result!.headers.get('Retry-After') ?? '0', 10)
    expect(retryAfter).toBeGreaterThan(0)
    expect(Number.isInteger(retryAfter)).toBe(true)
  })

  it('different identifiers are rate-limited independently', async () => {
    const limiter = makeLimiter(1)
    // Exhaust user-a's limit
    await checkRateLimit('user-a', limiter)
    const blockedA = await checkRateLimit('user-a', limiter)
    expect(blockedA).not.toBeNull()
    expect(blockedA!.status).toBe(429)

    // user-b should still be allowed
    const allowedB = await checkRateLimit('user-b', limiter)
    expect(allowedB).toBeNull()
  })
})

describe('getClientIp', () => {
  it('returns x-forwarded-for value when present', () => {
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4' })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })

  it('uses first IP from x-forwarded-for when multiple are present', () => {
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })

  it('falls back to x-real-ip when x-forwarded-for is absent', () => {
    const req = makeRequest({ 'x-real-ip': '9.10.11.12' })
    expect(getClientIp(req)).toBe('9.10.11.12')
  })

  it('returns null when no IP headers are present', () => {
    const req = makeRequest()
    expect(getClientIp(req)).toBe(null)
  })
})
