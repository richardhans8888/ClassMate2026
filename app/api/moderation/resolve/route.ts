import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { requireModerator } from '@/lib/authorize'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import {
  resolveFlag,
  FlagNotFoundError,
  FlagAlreadyResolvedError,
  InvalidResolutionActionError,
} from '@/lib/services/moderation.service'
import { notifyUser } from '@/lib/services/notification.service'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const isModerator = await requireModerator(session)
    if (!isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = (await req.json()) as { flagId?: string; action?: string; reason?: string }
    const { flagId, action, reason } = body

    if (!flagId || !action) {
      return NextResponse.json({ error: 'flagId and action are required' }, { status: 400 })
    }

    const trimmedReason = typeof reason === 'string' ? reason.trim() || undefined : undefined

    try {
      const updatedFlag = await resolveFlag(flagId, action, session.id, trimmedReason)

      // Send in-app notification to the content reporter when content is removed
      if (action === 'remove') {
        const flag = await prisma.flaggedContent.findUnique({
          where: { id: flagId },
          select: { reporterId: true },
        })
        if (flag) {
          notifyUser(
            flag.reporterId,
            'FLAG_REMOVE',
            'A moderator has reviewed your flag and removed the content.'
          ).catch((err: unknown) =>
            console.error('[notification] Failed to send notification:', err)
          )
        }
      }

      return NextResponse.json({ success: true, flag: updatedFlag }, { status: 200 })
    } catch (err) {
      if (err instanceof FlagNotFoundError) {
        return NextResponse.json({ error: 'Flag not found' }, { status: 404 })
      }
      if (err instanceof FlagAlreadyResolvedError) {
        return NextResponse.json({ error: 'Flag is already resolved' }, { status: 409 })
      }
      if (err instanceof InvalidResolutionActionError) {
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
      throw err
    }
  } catch (error: unknown) {
    console.error('Resolve flag error:', error)
    const message = error instanceof Error ? error.message : 'Failed to resolve flag'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
