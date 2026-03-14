import { GET } from '@/app/api/docs/route'

jest.mock('@/lib/swagger', () => ({
  swaggerSpec: {
    openapi: '3.0.3',
    info: {
      title: 'ClassMate API',
      version: '1.0.0',
      description: 'ClassMate Student Community Platform API',
    },
    paths: {
      '/api/auth/firebase': { post: {} },
      '/api/user/profile': { get: {}, patch: {} },
    },
  },
}))

// ─── GET /api/docs ────────────────────────────────────────────────────────────

describe('GET /api/docs', () => {
  it('returns 200 with a valid OpenAPI JSON structure', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('openapi')
    expect(body).toHaveProperty('info')
    expect(body).toHaveProperty('paths')
  })

  it('returns openapi version and a non-empty info.title', async () => {
    const res = await GET()
    const body = await res.json()
    expect(body.openapi).toBe('3.0.3')
    expect(typeof body.info.title).toBe('string')
    expect(body.info.title.length).toBeGreaterThan(0)
  })

  it('includes at least one path definition', async () => {
    const res = await GET()
    const body = await res.json()
    expect(Object.keys(body.paths).length).toBeGreaterThan(0)
  })

  it('sets a Cache-Control header for performance', async () => {
    const res = await GET()
    const cacheControl = res.headers.get('Cache-Control')
    expect(cacheControl).toContain('max-age')
  })
})
