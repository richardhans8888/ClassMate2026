import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { requireModerator } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import {
  resolveFlag,
  FlagNotFoundError,
  FlagAlreadyResolvedError,
} from '@/lib/services/moderation.service'

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

    const body = (await req.json()) as { flagId?: string; action?: string }
    const { flagId, action } = body

    if (!flagId || !action) {
      return NextResponse.json({ error: 'flagId and action are required' }, { status: 400 })
    }

    try {
      const updatedFlag = await resolveFlag(flagId, action, session.id)

      void prisma.moderationLog.create({
        data: {
          actorId: session.id,
          action: 'FLAG_RESOLVED',
          targetId: flagId,
          targetType: 'FlaggedContent',
          metadata: JSON.stringify({ resolution: action }),
        },
      })

      return NextResponse.json({ success: true, flag: updatedFlag }, { status: 200 })
    } catch (err) {
      if (err instanceof FlagNotFoundError) {
        return NextResponse.json({ error: 'Flag not found' }, { status: 404 })
      }
      if (err instanceof FlagAlreadyResolvedError) {
        return NextResponse.json({ error: 'Flag is already resolved' }, { status: 409 })
      }
      if (err instanceof Error) {
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
