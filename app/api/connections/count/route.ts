import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getConnectionCount } from '@/lib/connections'
import { checkRateLimit, generalLimiter } from '@/lib/rate-limit'

// GET /api/connections/count?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, generalLimiter)
    if (limited) return limited

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') ?? session.id

    const count = await getConnectionCount(userId)
    return NextResponse.json({ count })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
