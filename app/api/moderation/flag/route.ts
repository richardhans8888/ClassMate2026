import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import {
  flagContent,
  InvalidContentTypeError,
  ContentNotFoundError,
  DuplicateFlagError,
} from '@/lib/services/moderation.service'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const body = (await req.json()) as {
      contentType?: string
      contentId?: string
      reason?: string
    }

    const { contentType, contentId, reason } = body

    if (!contentType || !contentId || !reason) {
      return NextResponse.json(
        { error: 'contentType, contentId, and reason are required' },
        { status: 400 }
      )
    }

    try {
      const flag = await flagContent(session.id, contentType, contentId, reason)

      prisma.moderationLog
        .create({
          data: {
            actorId: session.id,
            action: 'FLAG_CREATED',
            targetId: flag.contentId,
            targetType: flag.contentType,
            reason: flag.reason,
          },
        })
        .catch((err: unknown) => console.error('[moderation-log] Failed to write audit log:', err))

      return NextResponse.json({ flag }, { status: 201 })
    } catch (err) {
      if (err instanceof InvalidContentTypeError) {
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
      if (err instanceof ContentNotFoundError) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }
      if (err instanceof DuplicateFlagError) {
        return NextResponse.json({ error: 'Content already flagged by this user' }, { status: 409 })
      }
      throw err
    }
  } catch (error: unknown) {
    console.error('Flag content error:', error)
    const message = error instanceof Error ? error.message : 'Failed to flag content'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
