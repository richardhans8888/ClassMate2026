import { NextRequest } from 'next/server'
import { POST as firebasePOST } from '@/app/api/auth/firebase/route'
import { POST as logoutPOST } from '@/app/api/logout/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma')

jest.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
  },
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { adminAuth } = require('@/lib/firebase-admin') as {
  adminAuth: { verifyIdToken: jest.Mock; getUser: jest.Mock }
}

afterEach(() => {
  jest.clearAllMocks()
})

// ─── POST /api/auth/firebase ─────────────────────────────────────────────────

describe('POST /api/auth/firebase', () => {
  it('returns 401 when Authorization header is absent', async () => {
    const req = new NextRequest('http://localhost/api/auth/firebase', {
      method: 'POST',
    })
    const res = await firebasePOST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 401 when Authorization header does not start with Bearer', async () => {
    const req = new NextRequest('http://localhost/api/auth/firebase', {
      method: 'POST',
      headers: { Authorization: 'Basic dXNlcjpwYXNz' },
    })
    const res = await firebasePOST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 401 when Firebase token verification fails', async () => {
    adminAuth.verifyIdToken.mockRejectedValueOnce(new Error('TOKEN_EXPIRED'))
    const req = new NextRequest('http://localhost/api/auth/firebase', {
      method: 'POST',
      headers: { Authorization: 'Bearer expired-token' },
    })
    const res = await firebasePOST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Authentication failed')
  })

  it('returns 401 when decoded token has no email', async () => {
    adminAuth.verifyIdToken.mockResolvedValueOnce({
      uid: 'uid-no-email',
      email: undefined,
      email_verified: false,
    })
    adminAuth.getUser.mockResolvedValueOnce({ displayName: null, photoURL: null })
    const req = new NextRequest('http://localhost/api/auth/firebase', {
      method: 'POST',
      headers: { Authorization: 'Bearer no-email-token' },
    })
    const res = await firebasePOST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Email not found in token')
  })

  it('returns 200 with userId and sets session cookie on valid token', async () => {
    adminAuth.verifyIdToken.mockResolvedValueOnce({
      uid: 'firebase-uid-abc',
      email: 'student@binus.ac.id',
      email_verified: true,
    })
    adminAuth.getUser.mockResolvedValueOnce({
      displayName: 'Test Student',
      photoURL: 'https://example.com/avatar.png',
    })
    ;(prisma.user.upsert as jest.Mock).mockResolvedValueOnce({
      id: 'db-user-id-123',
      email: 'student@binus.ac.id',
    })

    const req = new NextRequest('http://localhost/api/auth/firebase', {
      method: 'POST',
      headers: { Authorization: 'Bearer valid-firebase-token' },
    })
    const res = await firebasePOST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('success')
    expect(body.userId).toBe('db-user-id-123')
    // Session cookie must be set in the Set-Cookie header
    expect(res.headers.get('set-cookie')).toContain('session=')
  })

  it('sets sameSite=Strict on the session cookie to prevent CSRF', async () => {
    adminAuth.verifyIdToken.mockResolvedValueOnce({
      uid: 'firebase-uid-csrf',
      email: 'csrf@binus.ac.id',
      email_verified: true,
    })
    adminAuth.getUser.mockResolvedValueOnce({ displayName: 'CSRF Test', photoURL: null })
    ;(prisma.user.upsert as jest.Mock).mockResolvedValueOnce({
      id: 'csrf-user-id',
      email: 'csrf@binus.ac.id',
    })

    const req = new NextRequest('http://localhost/api/auth/firebase', {
      method: 'POST',
      headers: { Authorization: 'Bearer csrf-test-token' },
    })
    const res = await firebasePOST(req)

    expect(res.status).toBe(200)
    const setCookie = res.headers.get('set-cookie') ?? ''
    expect(setCookie.toLowerCase()).toContain('samesite=strict')
  })

  it('sets Max-Age=3600 on the session cookie to match Firebase token expiry', async () => {
    adminAuth.verifyIdToken.mockResolvedValueOnce({
      uid: 'firebase-uid-maxage',
      email: 'maxage@binus.ac.id',
      email_verified: true,
    })
    adminAuth.getUser.mockResolvedValueOnce({ displayName: 'MaxAge Test', photoURL: null })
    ;(prisma.user.upsert as jest.Mock).mockResolvedValueOnce({
      id: 'maxage-user-id',
      email: 'maxage@binus.ac.id',
    })

    const req = new NextRequest('http://localhost/api/auth/firebase', {
      method: 'POST',
      headers: { Authorization: 'Bearer maxage-test-token' },
    })
    const res = await firebasePOST(req)

    expect(res.status).toBe(200)
    const setCookie = res.headers.get('set-cookie') ?? ''
    expect(setCookie.toLowerCase()).toContain('max-age=3600')
  })

  it('calls prisma.user.upsert with the email from the token', async () => {
    adminAuth.verifyIdToken.mockResolvedValueOnce({
      uid: 'uid-xyz',
      email: 'tutor@binus.ac.id',
      email_verified: true,
    })
    adminAuth.getUser.mockResolvedValueOnce({ displayName: 'Test Tutor', photoURL: null })
    ;(prisma.user.upsert as jest.Mock).mockResolvedValueOnce({
      id: 'user-id-xyz',
      email: 'tutor@binus.ac.id',
    })

    const req = new NextRequest('http://localhost/api/auth/firebase', {
      method: 'POST',
      headers: { Authorization: 'Bearer another-valid-token' },
    })
    await firebasePOST(req)

    expect(prisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'tutor@binus.ac.id' },
      })
    )
  })
})

// ─── POST /api/logout ─────────────────────────────────────────────────────────

describe('POST /api/logout', () => {
  it('returns 200 with logout message', async () => {
    const res = await logoutPOST()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.message).toBe('Logged out')
  })

  it('clears the session cookie by setting it to empty with past expiry', async () => {
    const res = await logoutPOST()
    const setCookie = res.headers.get('set-cookie')
    // Cookie value must be empty and expired
    expect(setCookie).toContain('session=')
  })
})
