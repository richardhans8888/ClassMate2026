import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        upvoters: { where: { id: session.id }, select: { id: true } },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.userId === session.id) {
      return NextResponse.json({ error: 'Cannot upvote your own post' }, { status: 403 })
    }

    const hasUpvoted = post.upvoters.length > 0

    const updated = await prisma.forumPost.update({
      where: { id },
      data: {
        upvotes: hasUpvoted ? { decrement: 1 } : { increment: 1 },
        upvoters: hasUpvoted ? { disconnect: { id: session.id } } : { connect: { id: session.id } },
      },
      select: { upvotes: true },
    })

    return NextResponse.json({ upvotes: updated.upvotes, hasUpvoted: !hasUpvoted })
  } catch (error: unknown) {
    console.error('Upvote post error:', error)
    return NextResponse.json({ error: 'Failed to upvote post' }, { status: 500 })
  }
}
