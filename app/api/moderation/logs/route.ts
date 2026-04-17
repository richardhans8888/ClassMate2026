import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { requireAdmin, requireModerator } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, generalLimiter } from '@/lib/rate-limit'

const VALID_ACTIONS = ['FLAG_CREATED', 'FLAG_RESOLVED', 'CONTENT_DELETED'] as const

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, generalLimiter)
    if (limited) return limited

    const isAdmin = await requireAdmin(session)
    const isModerator = isAdmin || (await requireModerator(session))

    if (!isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const action = searchParams.get('action')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(limitParam ?? '50', 10) || 50))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    // Moderators (non-admin) can only see their own audit logs
    if (!isAdmin) {
      where.actorId = session.id
    }

    if (action) {
      if (!VALID_ACTIONS.includes(action as (typeof VALID_ACTIONS)[number])) {
        return NextResponse.json(
          { error: `action must be one of: ${VALID_ACTIONS.join(', ')}` },
          { status: 400 }
        )
      }
      where.action = action
    }

    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {}
      if (startDate) {
        const start = new Date(startDate)
        if (isNaN(start.getTime())) {
          return NextResponse.json({ error: 'Invalid startDate' }, { status: 400 })
        }
        dateFilter.gte = start
      }
      if (endDate) {
        const end = new Date(endDate)
        if (isNaN(end.getTime())) {
          return NextResponse.json({ error: 'Invalid endDate' }, { status: 400 })
        }
        dateFilter.lte = end
      }
      where.createdAt = dateFilter
    }

    const [logs, total] = await Promise.all([
      prisma.moderationLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: { select: { id: true, email: true, name: true } },
        },
      }),
      prisma.moderationLog.count({ where }),
    ])

    return NextResponse.json({ success: true, logs, total, page, limit }, { status: 200 })
  } catch (error: unknown) {
    console.error('Moderation logs error:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}
