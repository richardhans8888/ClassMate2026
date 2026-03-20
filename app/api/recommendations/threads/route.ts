import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type RecommendationItem = {
  id: string
  title: string
  category: string
  createdAt: Date
  upvotes: number
  views: number
  repliesCount: number
  score: number
  reasons: string[]
}

function daysSince(date: Date): number {
  const diffMs = Date.now() - date.getTime()
  return Math.floor(diffMs / 86400000)
}

function recencyScore(createdAt: Date): number {
  const days = daysSince(createdAt)
  return Math.max(0, 30 - days)
}

function engagementScore(upvotes: number, views: number, repliesCount: number): number {
  return upvotes * 3 + repliesCount * 4 + Math.floor(views / 20)
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [historyUser, flaggedPosts] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.id },
        select: {
          forumPosts: {
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
              category: true,
              tags: {
                select: { name: true },
              },
            },
          },
        },
      }),
      prisma.flaggedContent.findMany({
        where: {
          contentType: 'post',
          status: { in: ['pending', 'resolved'] },
        },
        select: { contentId: true },
      }),
    ])

    const excludedPostIds = new Set(flaggedPosts.map((flag) => flag.contentId))

    const posts = await prisma.forumPost.findMany({
      where: {
        id: { notIn: Array.from(excludedPostIds) },
      },
      include: {
        tags: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    const categories = new Set(
      (historyUser?.forumPosts ?? []).map((post) => post.category.toLowerCase())
    )
    const tags = new Set(
      (historyUser?.forumPosts ?? [])
        .flatMap((post) => post.tags)
        .map((tag) => tag.name.toLowerCase())
    )

    const hasHistory = categories.size > 0 || tags.size > 0

    const scored: RecommendationItem[] = posts.map((post) => {
      const lowerCategory = post.category.toLowerCase()
      const postTagNames = post.tags.map((tag) => tag.name.toLowerCase())

      const categoryMatch = categories.has(lowerCategory)
      const matchingTags = postTagNames.filter((tag) => tags.has(tag)).length

      const recency = recencyScore(post.createdAt)
      const engagement = engagementScore(post.upvotes, post.views, post.repliesCount)

      let score = recency + engagement
      const reasons: string[] = []

      if (hasHistory) {
        if (categoryMatch) {
          score += 40
          reasons.push(`Matches your recent ${post.category} activity`)
        }
        if (matchingTags > 0) {
          score += matchingTags * 15
          reasons.push(`Shares ${matchingTags} of your frequent topic tags`)
        }
      }

      if (repliesCountTrending(post.repliesCount, post.views, post.upvotes)) {
        reasons.push('Trending discussion')
      }

      if (reasons.length === 0) {
        reasons.push('Recent discussion')
      }

      return {
        id: post.id,
        title: post.title,
        category: post.category,
        createdAt: post.createdAt,
        upvotes: post.upvotes,
        views: post.views,
        repliesCount: post.repliesCount,
        score,
        reasons,
      }
    })

    const ordered = scored.sort((a, b) => b.score - a.score)
    const top = ordered.slice(0, 5)

    return NextResponse.json(
      {
        recommendations: top.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          createdAt: item.createdAt,
          upvotes: item.upvotes,
          views: item.views,
          repliesCount: item.repliesCount,
          reason: item.reasons[0],
          score: item.score,
        })),
        fallbackUsed: !hasHistory,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Recommendations GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}

function repliesCountTrending(repliesCount: number, views: number, upvotes: number): boolean {
  return repliesCount >= 2 || views >= 30 || upvotes >= 3
}
