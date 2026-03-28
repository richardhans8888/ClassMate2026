import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/user/me — returns current user data for both Firebase and Better Auth sessions
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [user, profile] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.id } }),
      prisma.userProfile.findUnique({ where: { userId: session.id } }),
    ])

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      avatarUrl: profile?.avatarUrl ?? null,
    })
  } catch (err) {
    console.error('[GET /api/user/me]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
