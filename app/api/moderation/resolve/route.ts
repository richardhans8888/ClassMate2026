import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { requireAdmin } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'

const ALLOWED_ACTIONS = ['dismiss', 'remove', 'warn'] as const

type AllowedAction = (typeof ALLOWED_ACTIONS)[number]

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const isAdmin = await requireAdmin(session)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = (await req.json()) as {
      flagId?: string
      action?: string
    }

    const flagId = body.flagId
    const action = body.action

    if (!flagId || !action) {
      return NextResponse.json({ error: 'flagId and action are required' }, { status: 400 })
    }

    if (!ALLOWED_ACTIONS.includes(action as AllowedAction)) {
      return NextResponse.json(
        { error: `action must be one of: ${ALLOWED_ACTIONS.join(', ')}` },
        { status: 400 }
      )
    }

    const flag = await prisma.flaggedContent.findUnique({
      where: { id: flagId },
      select: { id: true, status: true },
    })

    if (!flag) {
      return NextResponse.json({ error: 'Flag not found' }, { status: 404 })
    }

    if (flag.status !== 'pending') {
      return NextResponse.json({ error: 'Flag is already resolved' }, { status: 409 })
    }

    const updatedFlag = await prisma.flaggedContent.update({
      where: { id: flagId },
      data: {
        status: action === 'dismiss' ? 'dismissed' : 'resolved',
        resolvedBy: session.id,
        resolution: action,
        resolvedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, flag: updatedFlag }, { status: 200 })
  } catch (error: unknown) {
    console.error('Resolve flag error:', error)
    const message = error instanceof Error ? error.message : 'Failed to resolve flag'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
