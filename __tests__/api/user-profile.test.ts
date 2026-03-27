// app/api/user/profile/__tests__/route.test.ts
import { NextRequest } from 'next/server'
import { GET, PATCH } from '@/app/api/user/profile/route'

jest.mock('@/lib/prisma')
import { prisma } from '@/lib/prisma'

afterEach(() => {
  jest.clearAllMocks()
})

describe('GET /api/user/profile', () => {
  it('returns 400 when userId query param is missing', async () => {
    const req = new NextRequest('http://localhost/api/user/profile')
    const res = await GET(req)

    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string }
    expect(body.error).toMatch(/userId/i)
  })

  it('returns 200 when userId is provided', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-1' })
    ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(null)
    const req = new NextRequest('http://localhost/api/user/profile?userId=user-1')
    const res = await GET(req)

    expect(res.status).toBe(200)
  })
})

describe('PATCH /api/user/profile', () => {
  it('returns 400 when userId is missing from request body', async () => {
    const req = new NextRequest('http://localhost/api/user/profile', {
      method: 'PATCH',
      body: JSON.stringify({ display_name: 'Alice' }), // no userId
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req)

    expect(res.status).toBe(400)
  })

  it('returns 200 when userId is present', async () => {
    ;(prisma.userProfile.upsert as jest.Mock).mockResolvedValue({ userId: 'user-1' })
    const req = new NextRequest('http://localhost/api/user/profile', {
      method: 'PATCH',
      body: JSON.stringify({ userId: 'user-1', display_name: 'Alice' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req)

    expect(res.status).toBe(200)
  })
})
