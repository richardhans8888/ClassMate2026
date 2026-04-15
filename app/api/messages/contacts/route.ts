import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, generalLimiter } from '@/lib/rate-limit'

// GET /api/messages/contacts
// Returns all users who share at least one study group with the current user,
// excluding the current user themselves.
export async function GET(_req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, generalLimiter)
    if (limited) return limited

    // Find all group IDs the current user belongs to
    const memberships = await prisma.studyGroupMember.findMany({
      where: { userId: session.id },
      select: { groupId: true },
    })

    const groupIds = memberships.map((m) => m.groupId)

    if (groupIds.length === 0) {
      return NextResponse.json({ contacts: [] })
    }

    // Find all other members in those groups (deduplicated)
    const otherMembers = await prisma.studyGroupMember.findMany({
      where: {
        groupId: { in: groupIds },
        userId: { not: session.id },
      },
      select: {
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      distinct: ['userId'],
    })

    const contacts = otherMembers.map((m) => ({
      id: m.user.id,
      email: m.user.email,
      displayName: m.user.profile?.displayName ?? null,
      avatarUrl: m.user.profile?.avatarUrl ?? null,
    }))

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('[GET /api/messages/contacts]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
