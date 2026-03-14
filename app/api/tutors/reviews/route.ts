import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tutors/reviews?tutorId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tutorId = searchParams.get('tutorId')
  if (!tutorId) return NextResponse.json({ error: 'tutorId required' }, { status: 400 })

  try {
    const reviews = await prisma.tutorReview.findMany({
      where: { tutorId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: {
          include: { profile: true },
        },
      },
    })
    return NextResponse.json({ reviews })
  } catch (err) {
    console.error('[GET /api/tutors/reviews]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tutors/reviews — submit a review
export async function POST(req: NextRequest) {
  const { tutorId, studentId, rating, comment } = await req.json()
  if (!tutorId || !studentId || !rating)
    return NextResponse.json({ error: 'tutorId, studentId, rating required' }, { status: 400 })

  try {
    const existing = await prisma.tutorReview.findUnique({
      where: { tutorId_reviewerId: { tutorId, reviewerId: studentId } },
    })

    if (existing)
      return NextResponse.json({ error: 'You have already reviewed this tutor' }, { status: 400 })

    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.tutorReview.create({
        data: { tutorId, reviewerId: studentId, rating, comment: comment ?? null },
      })

      // Recalculate tutor average rating
      const allReviews = await tx.tutorReview.findMany({
        where: { tutorId },
        select: { rating: true },
      })
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      await tx.tutor.update({
        where: { id: tutorId },
        data: { rating: avgRating, reviewCount: allReviews.length },
      })

      // Award XP for leaving a review
      await tx.user.update({
        where: { id: studentId },
        data: { xp: { increment: 25 } },
      })
      await tx.pointTransaction.create({
        data: {
          userId: studentId,
          actionType: 'REVIEW_POSTED',
          points: 25,
          description: 'Left a tutor review',
        },
      })

      return newReview
    })

    return NextResponse.json({ review })
  } catch (err) {
    console.error('[POST /api/tutors/reviews]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
