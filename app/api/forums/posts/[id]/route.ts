import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { canDelete } from '@/lib/authorize'

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
    const authorized = await canDelete(session, post.userId)
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
