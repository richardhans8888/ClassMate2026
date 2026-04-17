import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { canModerate } from '@/lib/authorize'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'
import { FlagStatus, ModerationTargetType } from '@/generated/prisma/enums'
import {
  updateForumReply,
  deleteForumReply,
  ServiceValidationError,
} from '@/lib/services/forum.service'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const { id } = await context.params

    const reply = await prisma.forumReply.findUnique({ where: { id }, select: { userId: true } })
    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
    }

    if (session.id !== reply.userId) {
      return NextResponse.json({ error: 'Not authorized to edit this reply' }, { status: 403 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const contentRaw = typeof body.content === 'string' ? body.content : undefined

    if (contentRaw === undefined) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    try {
      const updated = await updateForumReply(id, contentRaw)
      return NextResponse.json({ reply: updated }, { status: 200 })
    } catch (err) {
      if (err instanceof ServiceValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
      throw err
    }
  } catch (error: unknown) {
    console.error('Patch reply error:', error)
    return NextResponse.json({ error: 'Failed to update reply' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

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

    let reason: string | undefined
    try {
      const body = (await request.json()) as { reason?: string }
      reason = typeof body.reason === 'string' ? body.reason.trim() || undefined : undefined
    } catch {
      // body is optional — ignore parse errors
    }

    await prisma.flaggedContent.updateMany({
      where: { contentType: 'reply', contentId: id, status: FlagStatus.pending },
      data: { status: FlagStatus.resolved, resolvedAt: new Date(), resolution: 'content_deleted' },
    })

    await deleteForumReply(id, reply.postId)

    await prisma.moderationLog.create({
      data: {
        actorId: session.id,
        action: 'CONTENT_DELETED',
        targetId: id,
        targetType: ModerationTargetType.ForumReply,
        reason: reason ?? null,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    console.error('Delete reply error:', error)
    return NextResponse.json({ error: 'Failed to delete reply' }, { status: 500 })
  }
}
