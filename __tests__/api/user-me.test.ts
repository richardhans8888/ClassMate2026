import { GET } from '@/app/api/user/me/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma')

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getSession } = require('@/lib/auth')

afterEach(() => {
  jest.clearAllMocks()
})

describe('GET /api/user/me', () => {
  it('returns 401 when no session exists', async () => {
    getSession.mockResolvedValueOnce(null)

    const res = await GET()

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 404 when user not found in database', async () => {
    getSession.mockResolvedValueOnce({
      id: 'user-id-123',
      email: 'user@example.com',
      name: 'Test User',
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null)
    ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValueOnce(null)

    const res = await GET()

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBe('User not found')
  })

  it('returns user data with role and null avatarUrl when no profile exists', async () => {
    getSession.mockResolvedValueOnce({
      id: 'user-id-123',
      email: 'student@example.com',
      name: 'Test Student',
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'user-id-123',
      email: 'student@example.com',
      name: 'Test Student',
      image: 'https://example.com/avatar.jpg',
      role: 'STUDENT',
    })
    ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValueOnce(null)

    const res = await GET()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      id: 'user-id-123',
      email: 'student@example.com',
      name: 'Test Student',
      image: 'https://example.com/avatar.jpg',
      role: 'STUDENT',
      avatarUrl: null,
    })
  })

  it('returns avatarUrl from UserProfile when profile exists', async () => {
    getSession.mockResolvedValueOnce({
      id: 'user-id-456',
      email: 'tutor@example.com',
      name: 'Test Tutor',
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'user-id-456',
      email: 'tutor@example.com',
      name: 'Test Tutor',
      image: null,
      role: 'TUTOR',
    })
    ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValueOnce({
      userId: 'user-id-456',
      avatarUrl: 'https://example.com/custom-avatar.png',
    })

    const res = await GET()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      id: 'user-id-456',
      email: 'tutor@example.com',
      name: 'Test Tutor',
      image: null,
      role: 'TUTOR',
      avatarUrl: 'https://example.com/custom-avatar.png',
    })
  })

  it('returns correct user data for ADMIN role', async () => {
    getSession.mockResolvedValueOnce({
      id: 'admin-id-789',
      email: 'admin@example.com',
      name: 'Admin User',
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'admin-id-789',
      email: 'admin@example.com',
      name: 'Admin User',
      image: 'https://example.com/admin.jpg',
      role: 'ADMIN',
    })
    ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValueOnce({
      userId: 'admin-id-789',
      avatarUrl: 'https://example.com/admin-profile.png',
    })

    const res = await GET()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.role).toBe('ADMIN')
    expect(body.avatarUrl).toBe('https://example.com/admin-profile.png')
  })

  it('calls prisma.user.findUnique with session id', async () => {
    getSession.mockResolvedValueOnce({
      id: 'session-user-id',
      email: 'user@example.com',
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'session-user-id',
      email: 'user@example.com',
      name: null,
      image: null,
      role: 'STUDENT',
    })
    ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValueOnce(null)

    await GET()

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'session-user-id' },
    })
  })

  it('calls prisma.userProfile.findUnique with session id', async () => {
    getSession.mockResolvedValueOnce({
      id: 'session-user-id',
      email: 'user@example.com',
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'session-user-id',
      email: 'user@example.com',
      name: null,
      image: null,
      role: 'STUDENT',
    })
    ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValueOnce(null)

    await GET()

    expect(prisma.userProfile.findUnique).toHaveBeenCalledWith({
      where: { userId: 'session-user-id' },
    })
  })

  it('returns 500 when database query throws an error', async () => {
    getSession.mockResolvedValueOnce({
      id: 'user-id-error',
      email: 'user@example.com',
    })
    ;(prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error('Database connection failed')
    )

    const res = await GET()

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Internal server error')
  })

  it('returns 500 when userProfile query throws an error', async () => {
    getSession.mockResolvedValueOnce({
      id: 'user-id-error',
      email: 'user@example.com',
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'user-id-error',
      email: 'user@example.com',
      name: null,
      image: null,
      role: 'STUDENT',
    })
    ;(prisma.userProfile.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error('Profile query failed')
    )

    const res = await GET()

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Internal server error')
  })

  it('executes both user and profile queries in parallel using Promise.all', async () => {
    getSession.mockResolvedValueOnce({
      id: 'user-id-parallel',
      email: 'user@example.com',
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'user-id-parallel',
      email: 'user@example.com',
      name: 'Test User',
      image: null,
      role: 'STUDENT',
    })
    ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValueOnce(null)

    await GET()

    // Both calls should have been made
    expect(prisma.user.findUnique).toHaveBeenCalled()
    expect(prisma.userProfile.findUnique).toHaveBeenCalled()
  })
})
