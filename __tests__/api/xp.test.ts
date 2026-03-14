import { NextRequest } from 'next/server'
import { POST } from '@/app/api/user/xp/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma')

afterEach(() => {
  jest.clearAllMocks()
})

// ─── POST /api/user/xp ────────────────────────────────────────────────────────

describe('POST /api/user/xp', () => {
  it('returns 400 when userId is missing', async () => {
    const req = new NextRequest('http://localhost/api/user/xp', {
      method: 'POST',
      body: JSON.stringify({ amount: 50, actionType: 'BOOKING_CREATED' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/userId/i)
  })

  it('returns 400 when amount is missing', async () => {
    const req = new NextRequest('http://localhost/api/user/xp', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-1', actionType: 'BOOKING_CREATED' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/amount/i)
  })

  it('returns 400 when actionType is missing', async () => {
    const req = new NextRequest('http://localhost/api/user/xp', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-1', amount: 50 }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/actionType/i)
  })

  it('returns 200 with updated xp and level on success', async () => {
    const mockUser = { id: 'user-1', xp: 550, level: 2 }

    // $transaction receives a callback — call it with a mock tx object
    ;(prisma.$transaction as jest.Mock).mockImplementation(
      async (callback: (tx: typeof prisma) => Promise<unknown>) => {
        const tx = {
          user: {
            update: jest.fn().mockResolvedValue(mockUser),
          },
          pointTransaction: {
            create: jest.fn().mockResolvedValue({}),
          },
        }
        return callback(tx as unknown as typeof prisma)
      }
    )

    const req = new NextRequest('http://localhost/api/user/xp', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-1',
        amount: 50,
        actionType: 'BOOKING_CREATED',
        description: 'Booking reward',
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.profile).toHaveProperty('xp')
    expect(body.profile).toHaveProperty('level')
    expect(body.profile.xp).toBe(550)
  })

  it('runs the XP update and pointTransaction.create inside a single transaction', async () => {
    const mockUser = { id: 'user-1', xp: 100, level: 1 }
    const txUserUpdate = jest.fn().mockResolvedValue(mockUser)
    const txPointCreate = jest.fn().mockResolvedValue({})

    ;(prisma.$transaction as jest.Mock).mockImplementation(
      async (callback: (tx: typeof prisma) => Promise<unknown>) => {
        const tx = {
          user: { update: txUserUpdate },
          pointTransaction: { create: txPointCreate },
        }
        return callback(tx as unknown as typeof prisma)
      }
    )

    const req = new NextRequest('http://localhost/api/user/xp', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-1', amount: 25, actionType: 'REVIEW_POSTED' }),
      headers: { 'Content-Type': 'application/json' },
    })
    await POST(req)

    expect(txUserUpdate).toHaveBeenCalled()
    expect(txPointCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          actionType: 'REVIEW_POSTED',
          points: 25,
        }),
      })
    )
  })
})
