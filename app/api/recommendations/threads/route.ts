import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { scoreAndRankPosts } from '@/lib/recommendations'

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

    const userCategories = new Set(
      (historyUser?.forumPosts ?? []).map((post) => post.category.toLowerCase())
    )
    const userTags = new Set(
      (historyUser?.forumPosts ?? [])
        .flatMap((post) => post.tags)
        .map((tag) => tag.name.toLowerCase())
    )

    const hasHistory = userCategories.size > 0 || userTags.size > 0
    const ranked = scoreAndRankPosts(posts, userCategories, userTags)
    const top = ranked.slice(0, 5)

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
