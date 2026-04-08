import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { requireModerator } from '@/lib/authorize'
import { checkRateLimit, generalLimiter } from '@/lib/rate-limit'
import { listFlaggedContent } from '@/lib/services/moderation.service'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, generalLimiter)
    if (limited) return limited

    const isModerator = await requireModerator(session)
    if (!isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? undefined

    const { flags } = await listFlaggedContent(status)

    return NextResponse.json({ flags }, { status: 200 })
  } catch (error: unknown) {
    console.error('Get flagged content error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch flagged content'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
