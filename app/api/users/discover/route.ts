import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getConnectionStatus } from '@/lib/connections'
import { checkRateLimit, generalLimiter } from '@/lib/rate-limit'

const PAGE_SIZE = 20

// GET /api/users/discover?page=1&search=xxx
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, generalLimiter)
    if (limited) return limited

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const search = searchParams.get('search') ?? ''

    const where = {
      id: { not: session.id },
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { profile: { displayName: { contains: search, mode: 'insensitive' as const } } },
              { profile: { university: { contains: search, mode: 'insensitive' as const } } },
              { profile: { major: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          role: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true,
              bio: true,
              university: true,
              major: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.user.count({ where }),
    ])

    // Attach connection status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const { status, connectionId } = await getConnectionStatus(session.id, user.id)
        return { ...user, connectionStatus: status, connectionId }
      })
    )

    return NextResponse.json({
      users: usersWithStatus,
      meta: {
        total,
        page,
        limit: PAGE_SIZE,
        pages: Math.ceil(total / PAGE_SIZE),
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
