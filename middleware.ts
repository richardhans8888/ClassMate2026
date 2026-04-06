import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/admin/:path*'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const firebaseSession = request.cookies.get('session')
    const betterAuthSession = request.cookies.get('better-auth.session_token')

    if (!firebaseSession && !betterAuthSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Role check is handled server-side in the page (requireModerator())
    // This middleware only ensures the user is logged in before hitting /admin/*
  }

  return NextResponse.next()
}
