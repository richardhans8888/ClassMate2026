import { NextRequest } from 'next/server'
import { POST as flagPOST } from '@/app/api/moderation/flag/route'
import { GET as flaggedGET } from '@/app/api/moderation/flagged/route'
import { POST as resolvePOST } from '@/app/api/moderation/resolve/route'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/prisma')

afterEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/moderation/flag', () => {
  it('returns 401 when unauthenticated', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/moderation/flag', {
      method: 'POST',
      body: JSON.stringify({ contentType: 'post', contentId: 'post-1', reason: 'spam' }),
    })

    const res = await flagPOST(req)
    expect(res.status).toBe(401)
  })

  it('creates a flag for valid content', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'user@test.com' })
    ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({ userId: 'author-1' })
    ;(prisma.flaggedContent.findFirst as jest.Mock).mockResolvedValue(null)
    ;(prisma.flaggedContent.create as jest.Mock).mockResolvedValue({
      id: 'flag-1',
      status: 'pending',
    })

    const req = new NextRequest('http://localhost/api/moderation/flag', {
      method: 'POST',
      body: JSON.stringify({ contentType: 'post', contentId: 'post-1', reason: 'spam links' }),
    })

    const res = await flagPOST(req)
    expect(res.status).toBe(201)
  })

  it('does not write to moderationLog when a student flags content', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'student-1', email: 'student@test.com' })
    ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({ userId: 'author-1' })
    ;(prisma.flaggedContent.findFirst as jest.Mock).mockResolvedValue(null)
    ;(prisma.flaggedContent.create as jest.Mock).mockResolvedValue({
      id: 'flag-2',
      status: 'pending',
    })

    const req = new NextRequest('http://localhost/api/moderation/flag', {
      method: 'POST',
      body: JSON.stringify({ contentType: 'post', contentId: 'post-1', reason: 'spam' }),
    })

    const res = await flagPOST(req)
    expect(res.status).toBe(201)
    expect(prisma.moderationLog.create).not.toHaveBeenCalled()
  })
})

describe('GET /api/moderation/flagged', () => {
  it('returns 403 for non-admin', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'user@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'STUDENT' })

    const req = new NextRequest('http://localhost/api/moderation/flagged')
    const res = await flaggedGET(req)

    expect(res.status).toBe(403)
  })

  it('returns flagged list for admin', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'admin-1', email: 'admin@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })
    ;(prisma.flaggedContent.findMany as jest.Mock).mockResolvedValue([{ id: 'flag-1' }])

    const req = new NextRequest('http://localhost/api/moderation/flagged')
    const res = await flaggedGET(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.flags).toHaveLength(1)
  })

  it('returns flagged list for MODERATOR', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'moderator-1', email: 'moderator@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'MODERATOR' })
    ;(prisma.flaggedContent.findMany as jest.Mock).mockResolvedValue([{ id: 'flag-1' }])

    const req = new NextRequest('http://localhost/api/moderation/flagged')
    const res = await flaggedGET(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.flags).toHaveLength(1)
  })
})

describe('POST /api/moderation/resolve', () => {
  it('resolves pending flags for admin', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'admin-1', email: 'admin@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })
    ;(prisma.$transaction as jest.Mock).mockImplementation(
      async (fn: (tx: typeof prisma) => unknown) => fn(prisma)
    )
    ;(prisma.flaggedContent.findUnique as jest.Mock).mockResolvedValue({
      id: 'flag-1',
      status: 'pending',
    })
    ;(prisma.flaggedContent.update as jest.Mock).mockResolvedValue({
      id: 'flag-1',
      status: 'resolved',
    })
    ;(prisma.moderationLog.create as jest.Mock).mockResolvedValue({})

    const req = new NextRequest('http://localhost/api/moderation/resolve', {
      method: 'POST',
      body: JSON.stringify({ flagId: 'flag-1', action: 'remove' }),
    })

    const res = await resolvePOST(req)
    expect(res.status).toBe(200)
  })

  it('resolves pending flags for MODERATOR', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'moderator-1', email: 'moderator@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'MODERATOR' })
    ;(prisma.$transaction as jest.Mock).mockImplementation(
      async (fn: (tx: typeof prisma) => unknown) => fn(prisma)
    )
    ;(prisma.flaggedContent.findUnique as jest.Mock).mockResolvedValue({
      id: 'flag-1',
      status: 'pending',
    })
    ;(prisma.flaggedContent.update as jest.Mock).mockResolvedValue({
      id: 'flag-1',
      status: 'resolved',
    })
    ;(prisma.moderationLog.create as jest.Mock).mockResolvedValue({})

    const req = new NextRequest('http://localhost/api/moderation/resolve', {
      method: 'POST',
      body: JSON.stringify({ flagId: 'flag-1', action: 'dismiss' }),
    })

    const res = await resolvePOST(req)
    expect(res.status).toBe(200)
  })

  it('returns 403 for STUDENT on resolve', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'student-1', email: 'student@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'STUDENT' })

    const req = new NextRequest('http://localhost/api/moderation/resolve', {
      method: 'POST',
      body: JSON.stringify({ flagId: 'flag-1', action: 'remove' }),
    })

    const res = await resolvePOST(req)
    expect(res.status).toBe(403)
  })
})
