import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeText, sanitizeMarkdown, containsXSSPatterns } from '@/lib/sanitize'

interface ModerationResult {
  safe: boolean
  toxicity_score: number
  spam_score: number
  categories: string[]
  action: 'approve' | 'warn' | 'block'
  reason: string
}

async function moderateContent(content: string): Promise<ModerationResult> {
  try {
    const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/moderation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: '', // Note: In production, you'd pass the auth cookie for internal calls
      },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      // Fallback to approve if moderation fails
      return {
        safe: true,
        toxicity_score: 0,
        spam_score: 0,
        categories: [],
        action: 'approve',
        reason: 'Moderation service unavailable, defaulting to approve',
      }
    }

    return await response.json()
  } catch (error) {
    console.error('Moderation error:', error)
    // Fallback to approve if moderation fails
    return {
      safe: true,
      toxicity_score: 0,
      spam_score: 0,
      categories: [],
      action: 'approve',
      reason: 'Moderation service error, defaulting to approve',
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const where = category && category !== 'all' ? { category } : {}

    const posts = await prisma.forumPost.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                major: true,
              },
            },
          },
        },
        tags: true,
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(posts, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, category, tags } = await req.json()

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'title, content, and category are required' },
        { status: 400 }
      )
    }

    const sanitizedTitle = sanitizeText(title)
    const sanitizedContent = sanitizeMarkdown(content)
    const sanitizedCategory = sanitizeText(category)

    // Log suspicious payloads for monitoring while still allowing moderation to decide action.
    if (containsXSSPatterns(String(title)) || containsXSSPatterns(String(content))) {
      console.warn('XSS pattern detected in forum post submission', {
        userId: user.id,
        timestamp: new Date().toISOString(),
      })
    }

    if (!sanitizedTitle || !sanitizedContent || !sanitizedCategory) {
      return NextResponse.json(
        { error: 'title, content, and category must contain valid text' },
        { status: 400 }
      )
    }

    // Moderate the content
    const moderationResult = await moderateContent(`${sanitizedTitle}\n\n${sanitizedContent}`)

    // Block if content is unsafe
    if (moderationResult.action === 'block') {
      return NextResponse.json(
        {
          error: 'Content blocked by moderation',
          moderation: {
            action: 'block',
            reason: moderationResult.reason,
            categories: moderationResult.categories,
          },
        },
        { status: 400 }
      )
    }

    // Create the post
    const post = await prisma.forumPost.create({
      data: {
        title: sanitizedTitle,
        content: sanitizedContent,
        category: sanitizedCategory,
        userId: user.id,
        tags: tags
          ? {
              create: tags.map((tag: string) => ({
                name: tag.trim().toLowerCase(),
              })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
              },
            },
          },
        },
        tags: true,
      },
    })

    // Return warning if content is borderline
    if (moderationResult.action === 'warn') {
      return NextResponse.json(
        {
          post,
          warning: {
            message: 'Post created with warning',
            reason: moderationResult.reason,
            categories: moderationResult.categories,
          },
        },
        { status: 201 }
      )
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
