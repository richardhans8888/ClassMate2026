import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { checkRateLimit, generalLimiter, getClientIp } from '@/lib/rate-limit'

// GET /api/user/stats  — returns stats for the authenticated user
// GET /api/user/stats?userId=xxx  — returns stats for a specific user (public profile use)
export async function GET(req: NextRequest) {
  const limited = await checkRateLimit(getClientIp(req), generalLimiter)
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const queryUserId = searchParams.get('userId')

  // Determine target user id — prefer session, fall back to query param
  let targetUserId: string
  if (queryUserId) {
    targetUserId = queryUserId
  } else {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    targetUserId = session.id
  }

  try {
    const [forumPostCount, studyGroupCount, connectionCount] = await Promise.all([
      prisma.forumPost.count({ where: { userId: targetUserId } }),
      prisma.studyGroupMember.count({ where: { userId: targetUserId } }),
      prisma.connection.count({
        where: {
          status: 'ACCEPTED',
          OR: [{ senderId: targetUserId }, { recipientId: targetUserId }],
        },
      }),
    ])

    return NextResponse.json({ forumPostCount, studyGroupCount, connectionCount })
  } catch (err) {
    console.error('[GET /api/user/stats]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
