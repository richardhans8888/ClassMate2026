import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { canDelete } from '@/lib/authorize'

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const reply = await prisma.forumReply.findUnique({
      where: { id },
      select: { userId: true, postId: true },
    })

    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
    }

    const authorized = await canDelete(session, reply.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to delete this reply' }, { status: 403 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.forumReply.delete({ where: { id } })
      await tx.forumPost.update({
        where: { id: reply.postId },
        data: { repliesCount: { decrement: 1 } },
      })
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    console.error('Delete reply error:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete reply'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
