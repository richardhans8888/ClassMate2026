import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { requireAdmin } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, generalLimiter } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, generalLimiter)
    if (limited) return limited

    const isAdmin = await requireAdmin(session)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')

    const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(limitParam ?? '50', 10) || 50))
    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          profile: {
            select: { displayName: true, avatarUrl: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({ success: true, users, total, page, limit }, { status: 200 })
  } catch (error: unknown) {
    console.error('Admin users GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
