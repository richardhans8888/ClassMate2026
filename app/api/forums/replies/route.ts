import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import {
  getForumReplies,
  enrichRepliesWithUpvotes,
  createForumReply,
  PostNotFoundError,
  ModerationBlockedError,
  ServiceValidationError,
} from '@/lib/services/forum.service'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'postId query parameter required' }, { status: 400 })
    }

    const replies = await getForumReplies(postId)
    const session = await getSession()
    const repliesWithUpvoted = await enrichRepliesWithUpvotes(replies, session?.id)

    return NextResponse.json({ replies: repliesWithUpvoted }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(user.id, writeLimiter)
    if (limited) return limited

    const { postId, content } = await req.json()

    if (!postId || !content) {
      return NextResponse.json({ error: 'postId and content are required' }, { status: 400 })
    }

    try {
      const result = await createForumReply(user.id, postId, content)
      return NextResponse.json(
        { reply: result.data, ...(result.warning && { warning: result.warning }) },
        { status: 201 }
      )
    } catch (err) {
      if (err instanceof PostNotFoundError) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      if (err instanceof ModerationBlockedError) {
        return NextResponse.json(
          {
            error: 'Content blocked by moderation',
            moderation: { action: 'block', reason: err.reason, categories: err.categories },
          },
          { status: 400 }
        )
      }
      if (err instanceof ServiceValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
      throw err
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
