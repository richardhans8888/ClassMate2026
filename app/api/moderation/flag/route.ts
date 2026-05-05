import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import {
  flagContent,
  InvalidContentTypeError,
  ContentNotFoundError,
  DuplicateFlagError,
  SelfFlagError,
} from '@/lib/services/moderation.service'
import { flagContentSchema } from '@/lib/schemas'
import { zodErrorToString } from '@/lib/errors'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const parsed = flagContentSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorToString(parsed.error) }, { status: 400 })
    }
    const { contentType, contentId, reason } = parsed.data

    try {
      const flag = await flagContent(session.id, contentType, contentId, reason)

      return NextResponse.json({ flag }, { status: 201 })
    } catch (err) {
      if (err instanceof SelfFlagError) {
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
      if (err instanceof InvalidContentTypeError) {
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
      if (err instanceof ContentNotFoundError) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }
      if (err instanceof DuplicateFlagError) {
        return NextResponse.json({ error: 'Content already flagged by this user' }, { status: 409 })
      }
      throw err
    }
  } catch (error: unknown) {
    console.error('Flag content error:', error)
    const message = error instanceof Error ? error.message : 'Failed to flag content'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
