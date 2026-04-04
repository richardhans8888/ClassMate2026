import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const { id } = await params

    const reply = await prisma.forumReply.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        upvoters: { where: { id: session.id }, select: { id: true } },
      },
    })

    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
    }

    if (reply.userId === session.id) {
      return NextResponse.json({ error: 'Cannot upvote your own reply' }, { status: 403 })
    }

    const hasUpvoted = reply.upvoters.length > 0

    const updated = await prisma.forumReply.update({
      where: { id },
      data: {
        upvotes: hasUpvoted ? { decrement: 1 } : { increment: 1 },
        upvoters: hasUpvoted ? { disconnect: { id: session.id } } : { connect: { id: session.id } },
      },
      select: { upvotes: true },
    })

    return NextResponse.json({ upvotes: updated.upvotes, hasUpvoted: !hasUpvoted })
  } catch (error: unknown) {
    console.error('Upvote reply error:', error)
    return NextResponse.json({ error: 'Failed to upvote reply' }, { status: 500 })
  }
}
