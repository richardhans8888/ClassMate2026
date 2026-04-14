import { NextRequest } from 'next/server'
import { GET } from '@/app/api/moderation/logs/route'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/prisma')

afterEach(() => {
  jest.clearAllMocks()
})

const adminSession = { id: 'admin-1', email: 'admin@test.com' }
const studentSession = { id: 'student-1', email: 'student@test.com' }
const tutorSession = { id: 'tutor-1', email: 'tutor@test.com' }

const mockLogs = [
  {
    id: 'log-1',
    actorId: 'admin-1',
    action: 'FLAG_CREATED',
    targetId: 'post-1',
    targetType: 'ForumPost',
    reason: 'spam',
    metadata: null,
    createdAt: new Date('2026-01-01'),
    actor: { id: 'admin-1', email: 'admin@test.com', name: 'Admin' },
  },
]

describe('GET /api/moderation/logs', () => {
  it('returns 401 if unauthenticated', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/moderation/logs')
    const res = await GET(req)

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 403 if user is STUDENT', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(studentSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'STUDENT' })

    const req = new NextRequest('http://localhost/api/moderation/logs')
    const res = await GET(req)

    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('Forbidden')
  })

  it('returns 403 if user is MODERATOR', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(tutorSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'MODERATOR' })

    const req = new NextRequest('http://localhost/api/moderation/logs')
    const res = await GET(req)

    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('Forbidden')
  })

  it('returns 200 with logs for ADMIN', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(adminSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })
    ;(prisma.moderationLog.findMany as jest.Mock).mockResolvedValue(mockLogs)
    ;(prisma.moderationLog.count as jest.Mock).mockResolvedValue(1)

    const req = new NextRequest('http://localhost/api/moderation/logs')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.logs).toHaveLength(1)
    expect(body.total).toBe(1)
    expect(body.page).toBe(1)
    expect(body.limit).toBe(50)
  })

  it('respects pagination params (page and limit)', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(adminSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })
    ;(prisma.moderationLog.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.moderationLog.count as jest.Mock).mockResolvedValue(20)

    const req = new NextRequest('http://localhost/api/moderation/logs?page=2&limit=10')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.page).toBe(2)
    expect(body.limit).toBe(10)

    expect(prisma.moderationLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 })
    )
  })

  it('filters by action when provided', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(adminSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })
    ;(prisma.moderationLog.findMany as jest.Mock).mockResolvedValue(mockLogs)
    ;(prisma.moderationLog.count as jest.Mock).mockResolvedValue(1)

    const req = new NextRequest('http://localhost/api/moderation/logs?action=FLAG_CREATED')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(prisma.moderationLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ action: 'FLAG_CREATED' }),
      })
    )
  })

  it('filters by date range when startDate and endDate provided', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(adminSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })
    ;(prisma.moderationLog.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.moderationLog.count as jest.Mock).mockResolvedValue(0)

    const req = new NextRequest(
      'http://localhost/api/moderation/logs?startDate=2026-01-01&endDate=2026-01-31'
    )
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(prisma.moderationLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          createdAt: expect.objectContaining({
            gte: new Date('2026-01-01'),
            lte: new Date('2026-01-31'),
          }),
        }),
      })
    )
  })
})
