import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { canModerate } from '@/lib/authorize'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'
import {
  getForumPost,
  incrementPostViews,
  enrichPostWithUpvote,
  updateForumPost,
  deleteForumPost,
  ServiceValidationError,
} from '@/lib/services/forum.service'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const post = await getForumPost(id)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await incrementPostViews(id)

    const session = await getSession()
    const postWithUpvote = await enrichPostWithUpvote(post, session?.id)

    return NextResponse.json(postWithUpvote, { status: 200 })
  } catch (error: unknown) {
    console.error('Get post error:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const { id } = await params

    const existing = await prisma.forumPost.findUnique({ where: { id }, select: { userId: true } })
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const authorized = await canModerate(session, existing.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to edit this post' }, { status: 403 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const title = typeof body.title === 'string' ? body.title : undefined
    const content = typeof body.content === 'string' ? body.content : undefined
    const category = typeof body.category === 'string' ? body.category : undefined

    try {
      const updated = await updateForumPost(id, { title, content, category })
      return NextResponse.json({ post: updated }, { status: 200 })
    } catch (err) {
      if (err instanceof ServiceValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
      throw err
    }
  } catch (error: unknown) {
    console.error('Patch post error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const { id } = await params

    const existing = await prisma.forumPost.findUnique({ where: { id }, select: { userId: true } })
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const authorized = await canModerate(session, existing.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to delete this post' }, { status: 403 })
    }

    await deleteForumPost(id)

    void (
      prisma as unknown as { moderationLog: { create: (args: unknown) => Promise<unknown> } }
    ).moderationLog.create({
      data: {
        actorId: session.id,
        action: 'CONTENT_DELETED',
        targetId: id,
        targetType: 'ForumPost',
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    console.error('Delete post error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
