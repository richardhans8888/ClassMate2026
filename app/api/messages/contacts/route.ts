import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, generalLimiter } from '@/lib/rate-limit'

// GET /api/messages/contacts
// Returns all users except the current user (max 200, sorted by email).
export async function GET(_req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, generalLimiter)
    if (limited) return limited

    const users = await prisma.user.findMany({
      where: { id: { not: session.id } },
      select: {
        id: true,
        email: true,
        name: true,
        profile: {
          select: { displayName: true, avatarUrl: true },
        },
      },
      orderBy: { email: 'asc' },
      take: 200,
    })

    const contacts = users.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.profile?.displayName ?? u.name ?? null,
      avatarUrl: u.profile?.avatarUrl ?? null,
    }))

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('[GET /api/messages/contacts]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
