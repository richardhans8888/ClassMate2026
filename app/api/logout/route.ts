import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' })

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/',
    sameSite: 'strict' as const,
  }

  response.cookies.set('session', '', cookieOptions)
  response.cookies.set('better-auth.session_token', '', cookieOptions)

  return response
}
