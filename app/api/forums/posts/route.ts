import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import {
  listForumPosts,
  enrichPostsWithUpvotes,
  createForumPost,
  ModerationBlockedError,
  ServiceValidationError,
} from '@/lib/services/forum.service'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') ?? undefined

    const posts = await listForumPosts(category)
    const session = await getSession()
    const postsWithUpvoted = await enrichPostsWithUpvotes(posts, session?.id)

    return NextResponse.json({ posts: postsWithUpvoted }, { status: 200 })
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

    const { title, content, category, tags } = await req.json()

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'title, content, and category are required' },
        { status: 400 }
      )
    }

    try {
      const result = await createForumPost(user.id, { title, content, category, tags })
      return NextResponse.json(
        { post: result.data, ...(result.warning && { warning: result.warning }) },
        { status: 201 }
      )
    } catch (err) {
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
