import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, generalLimiter, getClientIp } from '@/lib/rate-limit'

// GET /api/user/stats?userId=xxx
export async function GET(req: NextRequest) {
  const limited = await checkRateLimit(getClientIp(req), generalLimiter)
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const [forumPostCount, studyGroupCount] = await Promise.all([
      prisma.forumPost.count({ where: { userId } }),
      prisma.studyGroupMember.count({ where: { userId } }),
    ])

    return NextResponse.json({ forumPostCount, studyGroupCount })
  } catch (err) {
    console.error('[GET /api/user/stats]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
