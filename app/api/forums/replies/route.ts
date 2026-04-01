import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeMarkdown } from '@/lib/sanitize'
import { moderateContent } from '@/lib/moderation'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'postId query parameter required' }, { status: 400 })
    }

    const replies = await prisma.forumReply.findMany({
      where: { postId },
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
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const session = await getSession()
    let upvotedReplyIds = new Set<string>()
    if (session) {
      const userData = await prisma.user.findUnique({
        where: { id: session.id },
        select: { upvotedReplies: { select: { id: true } } },
      })
      upvotedReplyIds = new Set((userData?.upvotedReplies ?? []).map((r) => r.id))
    }

    const repliesWithUpvoted = replies.map((reply) => ({
      ...reply,
      hasUpvoted: upvotedReplyIds.has(reply.id),
    }))

    return NextResponse.json({ replies: repliesWithUpvoted }, { status: 200 })
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

    const { postId, content } = await req.json()

    // Validate required fields
    if (!postId || !content) {
      return NextResponse.json({ error: 'postId and content are required' }, { status: 400 })
    }

    const sanitizedContent = sanitizeMarkdown(content)
    if (!sanitizedContent) {
      return NextResponse.json({ error: 'content must contain valid text' }, { status: 400 })
    }

    // Verify post exists
    const post = await prisma.forumPost.findUnique({ where: { id: postId } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Moderate the content
    const moderationResult = await moderateContent(sanitizedContent)

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

    // Create the reply
    const reply = await prisma.forumReply.create({
      data: {
        content: sanitizedContent,
        postId,
        userId: user.id,
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
      },
    })

    // Increment replies count on the post
    await prisma.forumPost.update({
      where: { id: postId },
      data: { repliesCount: { increment: 1 } },
    })

    // Return warning if content is borderline
    if (moderationResult.action === 'warn') {
      return NextResponse.json(
        {
          reply,
          warning: {
            message: 'Reply created with warning',
            reason: moderationResult.reason,
            categories: moderationResult.categories,
          },
        },
        { status: 201 }
      )
    }

    return NextResponse.json({ reply }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
