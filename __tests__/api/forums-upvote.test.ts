import { NextRequest } from 'next/server'
import { POST as upvotePost } from '@/app/api/forums/posts/[id]/upvote/route'
import { POST as upvoteReply } from '@/app/api/forums/replies/[id]/upvote/route'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/auth', () => ({ getSession: jest.fn() }))
jest.mock('@/lib/prisma')

afterEach(() => {
  jest.clearAllMocks()
})

// ---------------------------------------------------------------------------
// POST /api/forums/posts/[id]/upvote
// ---------------------------------------------------------------------------

describe('POST /api/forums/posts/[id]/upvote', () => {
  it('returns 401 when unauthenticated', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/forums/posts/post-1/upvote', {
      method: 'POST',
    })
    const res = await upvotePost(req, { params: Promise.resolve({ id: 'post-1' }) })

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toMatch(/unauthorized/i)
  })

  it('returns 404 when post does not exist', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/forums/posts/nonexistent/upvote', {
      method: 'POST',
    })
    const res = await upvotePost(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/not found/i)
  })

  it('returns 403 when user tries to upvote their own post', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({
      id: 'post-1',
      userId: 'user-1',
      upvoters: [],
    })

    const req = new NextRequest('http://localhost/api/forums/posts/post-1/upvote', {
      method: 'POST',
    })
    const res = await upvotePost(req, { params: Promise.resolve({ id: 'post-1' }) })

    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toMatch(/cannot upvote your own/i)
  })

  it('adds upvote when user has not upvoted yet', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({
      id: 'post-1',
      userId: 'user-2',
      upvoters: [],
    })
    ;(prisma.forumPost.update as jest.Mock).mockResolvedValue({ upvotes: 1 })

    const req = new NextRequest('http://localhost/api/forums/posts/post-1/upvote', {
      method: 'POST',
    })
    const res = await upvotePost(req, { params: Promise.resolve({ id: 'post-1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.upvotes).toBe(1)
    expect(data.hasUpvoted).toBe(true)
    expect(prisma.forumPost.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          upvotes: { increment: 1 },
          upvoters: { connect: { id: 'user-1' } },
        }),
      })
    )
  })

  it('removes upvote when user has already upvoted (toggle)', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({
      id: 'post-1',
      userId: 'user-2',
      upvoters: [{ id: 'user-1' }],
    })
    ;(prisma.forumPost.update as jest.Mock).mockResolvedValue({ upvotes: 0 })

    const req = new NextRequest('http://localhost/api/forums/posts/post-1/upvote', {
      method: 'POST',
    })
    const res = await upvotePost(req, { params: Promise.resolve({ id: 'post-1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.upvotes).toBe(0)
    expect(data.hasUpvoted).toBe(false)
    expect(prisma.forumPost.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          upvotes: { decrement: 1 },
          upvoters: { disconnect: { id: 'user-1' } },
        }),
      })
    )
  })

  it('returns 500 with generic message on database error', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({
      id: 'post-1',
      userId: 'user-2',
      upvoters: [],
    })
    ;(prisma.forumPost.update as jest.Mock).mockRejectedValue(new Error('DB connection failed'))

    const req = new NextRequest('http://localhost/api/forums/posts/post-1/upvote', {
      method: 'POST',
    })
    const res = await upvotePost(req, { params: Promise.resolve({ id: 'post-1' }) })

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Failed to upvote post')
  })
})

// ---------------------------------------------------------------------------
// POST /api/forums/replies/[id]/upvote
// ---------------------------------------------------------------------------

describe('POST /api/forums/replies/[id]/upvote', () => {
  it('returns 401 when unauthenticated', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/forums/replies/reply-1/upvote', {
      method: 'POST',
    })
    const res = await upvoteReply(req, { params: Promise.resolve({ id: 'reply-1' }) })

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toMatch(/unauthorized/i)
  })

  it('returns 404 when reply does not exist', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/forums/replies/nonexistent/upvote', {
      method: 'POST',
    })
    const res = await upvoteReply(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/not found/i)
  })

  it('returns 403 when user tries to upvote their own reply', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue({
      id: 'reply-1',
      userId: 'user-1',
      upvoters: [],
    })

    const req = new NextRequest('http://localhost/api/forums/replies/reply-1/upvote', {
      method: 'POST',
    })
    const res = await upvoteReply(req, { params: Promise.resolve({ id: 'reply-1' }) })

    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toMatch(/cannot upvote your own/i)
  })

  it('adds upvote when user has not upvoted yet', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue({
      id: 'reply-1',
      userId: 'user-2',
      upvoters: [],
    })
    ;(prisma.forumReply.update as jest.Mock).mockResolvedValue({ upvotes: 1 })

    const req = new NextRequest('http://localhost/api/forums/replies/reply-1/upvote', {
      method: 'POST',
    })
    const res = await upvoteReply(req, { params: Promise.resolve({ id: 'reply-1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.upvotes).toBe(1)
    expect(data.hasUpvoted).toBe(true)
  })

  it('removes upvote when user has already upvoted (toggle)', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue({
      id: 'reply-1',
      userId: 'user-2',
      upvoters: [{ id: 'user-1' }],
    })
    ;(prisma.forumReply.update as jest.Mock).mockResolvedValue({ upvotes: 0 })

    const req = new NextRequest('http://localhost/api/forums/replies/reply-1/upvote', {
      method: 'POST',
    })
    const res = await upvoteReply(req, { params: Promise.resolve({ id: 'reply-1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.upvotes).toBe(0)
    expect(data.hasUpvoted).toBe(false)
  })

  it('returns 500 with generic message on database error', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue({
      id: 'reply-1',
      userId: 'user-2',
      upvoters: [],
    })
    ;(prisma.forumReply.update as jest.Mock).mockRejectedValue(new Error('DB connection failed'))

    const req = new NextRequest('http://localhost/api/forums/replies/reply-1/upvote', {
      method: 'POST',
    })
    const res = await upvoteReply(req, { params: Promise.resolve({ id: 'reply-1' }) })

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Failed to upvote reply')
  })
})
