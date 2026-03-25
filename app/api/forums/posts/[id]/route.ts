import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { canModerate } from '@/lib/authorize'
import { sanitizeText, sanitizeMarkdown } from '@/lib/sanitize'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const post = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
                major: true,
              },
            },
          },
        },
        tags: true,
        _count: {
          select: {
            replies: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment view count
    await prisma.forumPost.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json(post, { status: 200 })
  } catch (error: unknown) {
    console.error('Get post error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch post'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const authorized = await canModerate(session, post.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to edit this post' }, { status: 403 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const titleRaw = typeof body.title === 'string' ? body.title : undefined
    const contentRaw = typeof body.content === 'string' ? body.content : undefined
    const categoryRaw = typeof body.category === 'string' ? body.category : undefined

    const data: Record<string, unknown> = {}
    if (titleRaw !== undefined) {
      const sanitized = sanitizeText(titleRaw)
      if (!sanitized)
        return NextResponse.json({ error: 'title must contain valid text' }, { status: 400 })
      data.title = sanitized
    }
    if (contentRaw !== undefined) {
      const sanitized = sanitizeMarkdown(contentRaw)
      if (!sanitized)
        return NextResponse.json({ error: 'content must contain valid text' }, { status: 400 })
      data.content = sanitized
    }
    if (categoryRaw !== undefined) {
      const sanitized = sanitizeText(categoryRaw)
      if (!sanitized)
        return NextResponse.json({ error: 'category must contain valid text' }, { status: 400 })
      data.category = sanitized
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const updated = await prisma.forumPost.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, email: true, profile: { select: { displayName: true } } } },
        tags: true,
      },
    })

    return NextResponse.json({ post: updated }, { status: 200 })
  } catch (error: unknown) {
    console.error('Patch post error:', error)
    const message = error instanceof Error ? error.message : 'Failed to update post'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check authorization - must be owner or admin
    const authorized = await canModerate(session, post.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to delete this post' }, { status: 403 })
    }

    await prisma.forumPost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    console.error('Delete post error:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete post'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
