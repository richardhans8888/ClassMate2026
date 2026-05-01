import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, generalLimiter, writeLimiter, getClientIp } from '@/lib/rate-limit'
import { getErrorResponse } from '@/lib/errors'

const DISPLAY_NAME_MIN = 2
const DISPLAY_NAME_MAX = 50
const BIO_MAX = 500
const FIELD_MAX = 50

// GET /api/user/profile?userId=xxx
export async function GET(req: NextRequest) {
  const limited = await checkRateLimit(getClientIp(req), generalLimiter)
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const [user, profile] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.userProfile.findUnique({ where: { userId } }),
    ])

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        displayName: profile?.displayName ?? null,
        bio: profile?.bio ?? null,
        university: profile?.university ?? null,
        major: profile?.major ?? null,
        avatarUrl: profile?.avatarUrl ?? null,
      },
    })
  } catch (err) {
    console.error('[GET /api/user/profile]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/user/profile — update profile
export async function PATCH(req: NextRequest) {
  const limited = await checkRateLimit(getClientIp(req), writeLimiter)
  if (limited) return limited

  const { userId, displayName, bio, university, major, avatarUrl } = (await req.json()) as Record<
    string,
    unknown
  >
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  if (typeof displayName === 'string' && displayName.trim().length > 0) {
    if (displayName.trim().length < DISPLAY_NAME_MIN) {
      return NextResponse.json(
        { error: `Display name must be at least ${DISPLAY_NAME_MIN} characters` },
        { status: 400 }
      )
    }
    if (displayName.length > DISPLAY_NAME_MAX) {
      return NextResponse.json(
        { error: `Display name must be at most ${DISPLAY_NAME_MAX} characters` },
        { status: 400 }
      )
    }
  }
  if (typeof bio === 'string' && bio.length > BIO_MAX) {
    return NextResponse.json(
      { error: `Bio must be at most ${BIO_MAX} characters` },
      { status: 400 }
    )
  }
  if (typeof university === 'string' && university.length > FIELD_MAX) {
    return NextResponse.json(
      { error: `University must be at most ${FIELD_MAX} characters` },
      { status: 400 }
    )
  }
  if (typeof major === 'string' && major.length > FIELD_MAX) {
    return NextResponse.json(
      { error: `Major must be at most ${FIELD_MAX} characters` },
      { status: 400 }
    )
  }

  try {
    const profile = await prisma.userProfile.upsert({
      where: { userId: String(userId) },
      update: {
        ...(displayName !== undefined && { displayName: String(displayName) }),
        ...(bio !== undefined && { bio: String(bio) }),
        ...(university !== undefined && { university: String(university) }),
        ...(major !== undefined && { major: String(major) }),
        ...(avatarUrl !== undefined && { avatarUrl: String(avatarUrl) }),
      },
      create: {
        userId: String(userId),
        displayName: displayName != null ? String(displayName) : null,
        bio: bio != null ? String(bio) : null,
        university: university != null ? String(university) : null,
        major: major != null ? String(major) : null,
        avatarUrl: avatarUrl != null ? String(avatarUrl) : null,
      },
    })
    return NextResponse.json({ profile })
  } catch (err) {
    console.error('[PATCH /api/user/profile]', err)
    const { message, status } = getErrorResponse(err)
    return NextResponse.json({ error: message }, { status })
  }
}
