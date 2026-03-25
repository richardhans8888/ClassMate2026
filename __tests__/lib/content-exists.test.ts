import { contentExists, ALLOWED_CONTENT_TYPES } from '@/lib/content-exists'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma')

afterEach(() => {
  jest.clearAllMocks()
})

describe('ALLOWED_CONTENT_TYPES', () => {
  it('contains exactly three types', () => {
    expect(ALLOWED_CONTENT_TYPES).toHaveLength(3)
  })

  it('includes "post"', () => {
    expect(ALLOWED_CONTENT_TYPES).toContain('post')
  })

  it('includes "reply"', () => {
    expect(ALLOWED_CONTENT_TYPES).toContain('reply')
  })

  it('includes "material"', () => {
    expect(ALLOWED_CONTENT_TYPES).toContain('material')
  })
})

describe('contentExists', () => {
  describe('content type: post', () => {
    it('returns true when a post with the given id exists', async () => {
      ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({ id: 'post-1' })

      const result = await contentExists('post', 'post-1')

      expect(result).toBe(true)
      expect(prisma.forumPost.findUnique).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        select: { id: true },
      })
    })

    it('returns false when no post with the given id exists', async () => {
      ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await contentExists('post', 'nonexistent')

      expect(result).toBe(false)
    })

    it('does not query forumReply or studyMaterial for post type', async () => {
      ;(prisma.forumPost.findUnique as jest.Mock).mockResolvedValue({ id: 'post-1' })

      await contentExists('post', 'post-1')

      expect(prisma.forumReply.findUnique).not.toHaveBeenCalled()
      expect(prisma.studyMaterial.findUnique).not.toHaveBeenCalled()
    })
  })

  describe('content type: reply', () => {
    it('returns true when a reply with the given id exists', async () => {
      ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue({ id: 'reply-1' })

      const result = await contentExists('reply', 'reply-1')

      expect(result).toBe(true)
      expect(prisma.forumReply.findUnique).toHaveBeenCalledWith({
        where: { id: 'reply-1' },
        select: { id: true },
      })
    })

    it('returns false when no reply with the given id exists', async () => {
      ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await contentExists('reply', 'nonexistent')

      expect(result).toBe(false)
    })

    it('does not query forumPost or studyMaterial for reply type', async () => {
      ;(prisma.forumReply.findUnique as jest.Mock).mockResolvedValue({ id: 'reply-1' })

      await contentExists('reply', 'reply-1')

      expect(prisma.forumPost.findUnique).not.toHaveBeenCalled()
      expect(prisma.studyMaterial.findUnique).not.toHaveBeenCalled()
    })
  })

  describe('unknown content type (runtime cast)', () => {
    it('returns false without querying any table', async () => {
      const result = await contentExists('unknown' as AllowedContentType, 'any-id')

      expect(result).toBe(false)
      expect(prisma.forumPost.findUnique).not.toHaveBeenCalled()
      expect(prisma.forumReply.findUnique).not.toHaveBeenCalled()
      expect(prisma.studyMaterial.findUnique).not.toHaveBeenCalled()
    })
  })

  describe('content type: material', () => {
    it('returns true when a material with the given id exists', async () => {
      ;(prisma.studyMaterial.findUnique as jest.Mock).mockResolvedValue({ id: 'material-1' })

      const result = await contentExists('material', 'material-1')

      expect(result).toBe(true)
      expect(prisma.studyMaterial.findUnique).toHaveBeenCalledWith({
        where: { id: 'material-1' },
        select: { id: true },
      })
    })

    it('returns false when no material with the given id exists', async () => {
      ;(prisma.studyMaterial.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await contentExists('material', 'nonexistent')

      expect(result).toBe(false)
    })

    it('does not query forumPost or forumReply for material type', async () => {
      ;(prisma.studyMaterial.findUnique as jest.Mock).mockResolvedValue({ id: 'material-1' })

      await contentExists('material', 'material-1')

      expect(prisma.forumPost.findUnique).not.toHaveBeenCalled()
      expect(prisma.forumReply.findUnique).not.toHaveBeenCalled()
    })
  })
})
