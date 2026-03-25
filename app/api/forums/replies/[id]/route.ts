import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { canModerate } from '@/lib/authorize'
import { sanitizeMarkdown } from '@/lib/sanitize'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const reply = await prisma.forumReply.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
    }

    const authorized = await canModerate(session, reply.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to edit this reply' }, { status: 403 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const contentRaw = typeof body.content === 'string' ? body.content : undefined

    if (contentRaw === undefined) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    const sanitized = sanitizeMarkdown(contentRaw)
    if (!sanitized) {
      return NextResponse.json({ error: 'content must contain valid text' }, { status: 400 })
    }

    const updated = await prisma.forumReply.update({
      where: { id },
      data: { content: sanitized },
      include: {
        user: { select: { id: true, email: true, profile: { select: { displayName: true } } } },
      },
    })

    return NextResponse.json({ reply: updated }, { status: 200 })
  } catch (error: unknown) {
    console.error('Patch reply error:', error)
    return NextResponse.json({ error: 'Failed to update reply' }, { status: 500 })
  }
}

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

    const authorized = await canModerate(session, reply.userId)
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
    return NextResponse.json({ error: 'Failed to delete reply' }, { status: 500 })
  }
}
