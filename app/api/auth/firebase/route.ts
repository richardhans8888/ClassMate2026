import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import { authLimiter, checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const limited = await checkRateLimit(ip, authLimiter)
  if (limited) return limited

  const authorization = req.headers.get('Authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const idToken = authorization.split('Bearer ')[1]!

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken, true)

    const uid = decodedToken.uid
    const email = decodedToken.email
    if (!email) {
      return NextResponse.json({ error: 'Email not found in token' }, { status: 401 })
    }

    const userRecord = await adminAuth.getUser(uid)
    const displayName = userRecord.displayName ?? decodedToken.name ?? null
    const name = displayName ?? email.split('@')[0]
    const image = userRecord.photoURL ?? (decodedToken as { picture?: string }).picture ?? null

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        ...(image !== null ? { image } : {}),
      },
      create: {
        email,
        name,
        image,
        emailVerified: decodedToken.email_verified ?? false,
      },
    })

    const response = NextResponse.json({ status: 'success', userId: user.id })
    response.cookies.set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour — matches Firebase ID token expiry
    })

    return response
  } catch (error) {
    console.error('Firebase auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
