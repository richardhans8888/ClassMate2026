// app/api/tutors/__tests__/route.test.ts
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/tutors/route'

jest.mock('@/lib/prisma')
import { prisma } from '@/lib/prisma'

afterEach(() => {
  jest.clearAllMocks()
})

describe('GET /api/tutors', () => {
  beforeEach(() => {
    ;(prisma.tutor.findMany as jest.Mock).mockResolvedValue([])
  })

  it('returns 200 with an empty tutors array when no filters are applied', async () => {
    const req = new NextRequest('http://localhost/api/tutors')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const body = (await res.json()) as { tutors: unknown[] }
    expect(Array.isArray(body.tutors)).toBe(true)
  })

  it('returns 200 when subject filter is provided', async () => {
    const req = new NextRequest('http://localhost/api/tutors?subject=Mathematics')
    const res = await GET(req)

    expect(res.status).toBe(200)
  })

  it('returns 200 when search param is provided', async () => {
    const req = new NextRequest('http://localhost/api/tutors?search=john')
    const res = await GET(req)

    expect(res.status).toBe(200)
  })
})

describe('POST /api/tutors', () => {
  it('returns 400 when userId is missing', async () => {
    const req = new NextRequest('http://localhost/api/tutors', {
      method: 'POST',
      body: JSON.stringify({ subjects: ['Math', 'Physics'] }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string }
    expect(body.error).toMatch(/userId/i)
  })

  it('returns 400 when subjects is missing', async () => {
    const req = new NextRequest('http://localhost/api/tutors', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-1' }), // no subjects
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string }
    expect(body.error).toMatch(/subjects/i)
  })
})
