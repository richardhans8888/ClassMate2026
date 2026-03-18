import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
