// app/api/notifications/__tests__/route.test.ts
import { NextRequest } from 'next/server'
import { GET, PATCH, DELETE } from '@/app/api/notifications/route'

jest.mock('@/lib/prisma')
import { prisma } from '@/lib/prisma'

afterEach(() => {
  jest.clearAllMocks()
})

describe('GET /api/notifications', () => {
  it('returns 400 when userId query param is missing', async () => {
    const req = new NextRequest('http://localhost/api/notifications')
    const res = await GET(req)

    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string }
    expect(body.error).toMatch(/userId/i)
  })

  it('returns 200 when userId is provided', async () => {
    ;(prisma.notification.findMany as jest.Mock).mockResolvedValue([])
    const req = new NextRequest('http://localhost/api/notifications?userId=user-1')
    const res = await GET(req)

    expect(res.status).toBe(200)
  })
})

describe('PATCH /api/notifications', () => {
  it('returns 400 when userId is missing from request body', async () => {
    const req = new NextRequest('http://localhost/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ markAllRead: true }), // no userId
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req)

    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/notifications', () => {
  it('returns 400 when notificationId query param is missing', async () => {
    const req = new NextRequest(
      'http://localhost/api/notifications?userId=user-1'
      // notificationId is intentionally omitted
    )
    const res = await DELETE(req)

    expect(res.status).toBe(400)
  })
})
