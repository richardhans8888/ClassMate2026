import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tutors?subject=Math&search=john
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const search = searchParams.get('search')
  const available = searchParams.get('available')

  try {
    const tutors = await prisma.tutor.findMany({
      where: {
        ...(subject ? { subjects: { has: subject } } : {}),
        ...(available === 'true' ? { isAvailable: true } : {}),
        ...(search
          ? {
              user: {
                profile: {
                  displayName: { contains: search, mode: 'insensitive' },
                },
              },
            }
          : {}),
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
      orderBy: { rating: 'desc' },
    })
    return NextResponse.json({ tutors })
  } catch (err) {
    console.error('[GET /api/tutors]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tutors — register as a tutor
export async function POST(req: NextRequest) {
  const { userId, subjects, hourlyRate, bio } = await req.json()
  if (!userId || !subjects)
    return NextResponse.json({ error: 'userId and subjects required' }, { status: 400 })

  try {
    const tutor = await prisma.tutor.upsert({
      where: { userId },
      update: {
        subjects: subjects ?? [],
        hourlyRate: hourlyRate ?? 0,
        bio: bio ?? null,
      },
      create: {
        userId,
        subjects: subjects ?? [],
        hourlyRate: hourlyRate ?? 0,
        bio: bio ?? null,
      },
    })

    // Update user role to TUTOR
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'TUTOR' },
    })

    return NextResponse.json({ tutor })
  } catch (err) {
    console.error('[POST /api/tutors]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
