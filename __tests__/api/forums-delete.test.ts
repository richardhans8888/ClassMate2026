import { NextRequest } from 'next/server'
import { DELETE as deletePost } from '@/app/api/forums/posts/[id]/route'
import { DELETE as deleteReply } from '@/app/api/forums/replies/[id]/route'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/prisma')

afterEach(() => {
  jest.clearAllMocks()
})

describe('DELETE /api/forums/posts/[id]', () => {
  it('returns 401 for unauthenticated requests', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/forums/posts/post-1', { method: 'DELETE' })
    const res = await deletePost(req, { params: Promise.resolve({ id: 'post-1' }) })

    expect(res.status).toBe(401)
  })

  it('returns 403 for non-owner non-admin', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-2', email: 'u2@test.com' })
    ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({ userId: 'user-1' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'STUDENT' })

    const req = new NextRequest('http://localhost/api/forums/posts/post-1', { method: 'DELETE' })
    const res = await deletePost(req, { params: Promise.resolve({ id: 'post-1' }) })

    expect(res.status).toBe(403)
  })

  it('allows owner to delete post', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({ userId: 'user-1' })

    const req = new NextRequest('http://localhost/api/forums/posts/post-1', { method: 'DELETE' })
    const res = await deletePost(req, { params: Promise.resolve({ id: 'post-1' }) })

    expect(res.status).toBe(200)
    expect(prisma.forumPost.delete).toHaveBeenCalledWith({ where: { id: 'post-1' } })
  })
})

describe('DELETE /api/forums/replies/[id]', () => {
  it('returns 404 when reply does not exist', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/forums/replies/reply-1', { method: 'DELETE' })
    const res = await deleteReply(req, { params: Promise.resolve({ id: 'reply-1' }) })

    expect(res.status).toBe(404)
  })

  it('allows admin to delete reply and update post counters', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'admin-1', email: 'admin@test.com' })
    ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue({
      userId: 'user-1',
      postId: 'post-1',
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })
    ;(prisma.$transaction as jest.Mock).mockImplementation(async (callback) => callback(prisma))

    const req = new NextRequest('http://localhost/api/forums/replies/reply-1', { method: 'DELETE' })
    const res = await deleteReply(req, { params: Promise.resolve({ id: 'reply-1' }) })

    expect(res.status).toBe(200)
    expect(prisma.forumReply.delete).toHaveBeenCalledWith({ where: { id: 'reply-1' } })
    expect(prisma.forumPost.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 'post-1' }),
      })
    )
  })
})
