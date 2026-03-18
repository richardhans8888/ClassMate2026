import { canModerate, requireAdmin, requireRole } from '@/lib/authorize'
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
  })
})
