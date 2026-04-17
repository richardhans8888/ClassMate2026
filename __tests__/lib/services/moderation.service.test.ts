/**
 * lib/services/moderation.service.ts — Unit tests
 *
 * Mocks: prisma, content-exists, sanitize
 */

import {
  flagContent,
  resolveFlag,
  listFlaggedContent,
  InvalidContentTypeError,
  ContentNotFoundError,
  DuplicateFlagError,
  SelfFlagError,
  FlagNotFoundError,
  FlagAlreadyResolvedError,
  InvalidResolutionActionError,
} from '@/lib/services/moderation.service'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma')
jest.mock('@/lib/sanitize', () => ({
  sanitizeText: (s: string) => s,
}))
jest.mock('@/lib/content-exists', () => ({
  ALLOWED_CONTENT_TYPES: ['post', 'reply', 'material'],
  contentExists: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

beforeEach(() => {
  jest.clearAllMocks()
  // Default: content exists and author is different from the flagging user
  mockPrisma.forumPost.findUnique.mockResolvedValue({ userId: 'author-1' } as never)
  // Wire $transaction to run the callback with the same mock prisma instance
  ;(mockPrisma.$transaction as jest.Mock).mockImplementation(
    async (fn: (tx: typeof prisma) => unknown) => fn(mockPrisma)
  )
})

// ─── flagContent ──────────────────────────────────────────────────────────────

describe('flagContent', () => {
  it('creates a flag when content exists and not already flagged', async () => {
    mockPrisma.flaggedContent.findFirst.mockResolvedValue(null as never)
    const flag = {
      id: 'f1',
      contentType: 'post',
      contentId: 'p1',
      reason: 'spam',
      status: 'pending',
      createdAt: new Date(),
    }
    mockPrisma.flaggedContent.create.mockResolvedValue(flag as never)

    const result = await flagContent('u1', 'post', 'p1', 'spam')

    expect(result).toBe(flag)
    expect(mockPrisma.flaggedContent.create).toHaveBeenCalledTimes(1)
  })

  it('throws InvalidContentTypeError for unrecognised content type', async () => {
    await expect(flagContent('u1', 'video', 'v1', 'reason')).rejects.toThrow(
      InvalidContentTypeError
    )
    expect(mockPrisma.flaggedContent.create).not.toHaveBeenCalled()
  })

  it('throws ContentNotFoundError when content does not exist', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue(null as never)

    await expect(flagContent('u1', 'post', 'nonexistent', 'reason')).rejects.toThrow(
      ContentNotFoundError
    )
  })

  it('throws SelfFlagError when user flags their own content', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({ userId: 'u1' } as never)

    await expect(flagContent('u1', 'post', 'p1', 'spam')).rejects.toThrow(SelfFlagError)
    expect(mockPrisma.flaggedContent.create).not.toHaveBeenCalled()
  })

  it('throws DuplicateFlagError when user already flagged this content', async () => {
    mockPrisma.flaggedContent.findFirst.mockResolvedValue({ id: 'existing' } as never)

    await expect(flagContent('u1', 'post', 'p1', 'spam')).rejects.toThrow(DuplicateFlagError)
    expect(mockPrisma.flaggedContent.create).not.toHaveBeenCalled()
  })
})

// ─── resolveFlag ──────────────────────────────────────────────────────────────

describe('resolveFlag', () => {
  it('resolves a pending flag', async () => {
    mockPrisma.flaggedContent.findUnique.mockResolvedValue({ id: 'f1', status: 'pending' } as never)
    const resolved = { id: 'f1', status: 'resolved', resolution: 'dismiss' }
    mockPrisma.flaggedContent.update.mockResolvedValue(resolved as never)
    mockPrisma.moderationLog.create.mockResolvedValue({} as never)

    const result = await resolveFlag('f1', 'dismiss', 'admin1')

    expect(result).toBe(resolved)
    expect(mockPrisma.flaggedContent.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'f1' } })
    )
  })

  it('throws FlagNotFoundError when flag does not exist', async () => {
    mockPrisma.flaggedContent.findUnique.mockResolvedValue(null as never)

    await expect(resolveFlag('nonexistent', 'dismiss', 'admin1')).rejects.toThrow(FlagNotFoundError)
  })

  it('throws FlagAlreadyResolvedError when flag is not pending', async () => {
    mockPrisma.flaggedContent.findUnique.mockResolvedValue({
      id: 'f1',
      status: 'resolved',
    } as never)

    await expect(resolveFlag('f1', 'dismiss', 'admin1')).rejects.toThrow(FlagAlreadyResolvedError)
  })

  it('throws Error for invalid action', async () => {
    mockPrisma.flaggedContent.findUnique.mockResolvedValue({ id: 'f1', status: 'pending' } as never)

    await expect(resolveFlag('f1', 'invalid_action', 'admin1')).rejects.toThrow()
  })

  it('throws InvalidResolutionActionError for warn action', async () => {
    await expect(resolveFlag('f1', 'warn', 'admin1')).rejects.toThrow(InvalidResolutionActionError)
    expect(mockPrisma.flaggedContent.update).not.toHaveBeenCalled()
  })

  it('sets status to "dismissed" for dismiss action', async () => {
    mockPrisma.flaggedContent.findUnique.mockResolvedValue({ id: 'f1', status: 'pending' } as never)
    mockPrisma.flaggedContent.update.mockResolvedValue({} as never)
    mockPrisma.moderationLog.create.mockResolvedValue({} as never)

    await resolveFlag('f1', 'dismiss', 'admin1')

    expect(mockPrisma.flaggedContent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'dismissed' }),
      })
    )
  })

  it('sets status to "resolved" for remove action', async () => {
    mockPrisma.flaggedContent.findUnique.mockResolvedValue({ id: 'f1', status: 'pending' } as never)
    mockPrisma.flaggedContent.update.mockResolvedValue({} as never)
    mockPrisma.moderationLog.create.mockResolvedValue({} as never)

    await resolveFlag('f1', 'remove', 'admin1')

    expect(mockPrisma.flaggedContent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'resolved' }),
      })
    )
  })
})

// ─── listFlaggedContent ───────────────────────────────────────────────────────

describe('listFlaggedContent', () => {
  it('returns all flags when no status provided', async () => {
    const flags = [{ id: 'f1' }, { id: 'f2' }]
    mockPrisma.flaggedContent.findMany.mockResolvedValue(flags as never)

    const result = await listFlaggedContent()

    expect(result.flags).toBe(flags)
    expect(mockPrisma.flaggedContent.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: undefined })
    )
  })

  it('filters by status when provided', async () => {
    mockPrisma.flaggedContent.findMany.mockResolvedValue([] as never)

    await listFlaggedContent('pending')

    expect(mockPrisma.flaggedContent.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'pending' } })
    )
  })

  it('applies limit parameter', async () => {
    mockPrisma.flaggedContent.findMany.mockResolvedValue([] as never)

    await listFlaggedContent(undefined, 10)

    expect(mockPrisma.flaggedContent.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 })
    )
  })
})
