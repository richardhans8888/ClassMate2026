import { canModerate, requireAdmin, requireModerator, requireRole } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma')

describe('authorize', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('requireRole', () => {
    it('returns true when user has allowed role', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })

      const result = await requireRole({ id: '1', email: 'test@test.com' }, ['ADMIN'])
      expect(result).toBe(true)
    })

    it('returns false when user lacks role', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'STUDENT' })

      const result = await requireRole({ id: '1', email: 'test@test.com' }, ['ADMIN'])
      expect(result).toBe(false)
    })
  })

  describe('requireAdmin', () => {
    it('returns true for admin role', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })
      const result = await requireAdmin({ id: 'admin-1', email: 'admin@test.com' })
      expect(result).toBe(true)
    })
  })

  describe('requireModerator', () => {
    it('returns true for TUTOR role', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'TUTOR' })
      const result = await requireModerator({ id: 'tutor-1', email: 'tutor@test.com' })
      expect(result).toBe(true)
    })

    it('returns true for ADMIN role', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })
      const result = await requireModerator({ id: 'admin-1', email: 'admin@test.com' })
      expect(result).toBe(true)
    })

    it('returns false for STUDENT role', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'STUDENT' })
      const result = await requireModerator({ id: 'student-1', email: 'student@test.com' })
      expect(result).toBe(false)
    })
  })

  describe('canModerate', () => {
    it('allows resource owner', async () => {
      const result = await canModerate({ id: 'user1', email: 'test@test.com' }, 'user1')
      expect(result).toBe(true)
    })

    it('allows admin for any resource', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' })

      const result = await canModerate({ id: 'admin1', email: 'admin@test.com' }, 'user1')
      expect(result).toBe(true)
    })

    it('denies non-owner non-admin', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'STUDENT' })

      const result = await canModerate({ id: 'user2', email: 'other@test.com' }, 'user1')
      expect(result).toBe(false)
    })

    it('allows TUTOR for non-owned resource', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'TUTOR' })
      const result = await canModerate({ id: 'tutor1', email: 'tutor@test.com' }, 'user1')
      expect(result).toBe(true)
    })
  })
})
