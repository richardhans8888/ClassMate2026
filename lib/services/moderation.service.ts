import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/sanitize'
import { ALLOWED_CONTENT_TYPES, contentExists, type AllowedContentType } from '@/lib/content-exists'

// --- Custom errors ---
export class InvalidContentTypeError extends Error {
  constructor() {
    super(`contentType must be one of: ${ALLOWED_CONTENT_TYPES.join(', ')}`)
    this.name = 'InvalidContentTypeError'
  }
}

export class ContentNotFoundError extends Error {
  constructor() {
    super('Content not found')
    this.name = 'ContentNotFoundError'
  }
}

export class DuplicateFlagError extends Error {
  constructor() {
    super('Content already flagged by this user')
    this.name = 'DuplicateFlagError'
  }
}

export class FlagNotFoundError extends Error {
  constructor() {
    super('Flag not found')
    this.name = 'FlagNotFoundError'
  }
}

export class FlagAlreadyResolvedError extends Error {
  constructor() {
    super('Flag is already resolved')
    this.name = 'FlagAlreadyResolvedError'
  }
}

const ALLOWED_ACTIONS = ['dismiss', 'remove', 'warn'] as const
type ResolutionAction = (typeof ALLOWED_ACTIONS)[number]

export class InvalidResolutionActionError extends Error {
  constructor() {
    super(`action must be one of: ${ALLOWED_ACTIONS.join(', ')}`)
    this.name = 'InvalidResolutionActionError'
  }
}

// --- Service functions ---

export async function flagContent(
  userId: string,
  contentType: string,
  contentId: string,
  reason: string
) {
  const sanitizedContentId = sanitizeText(contentId) ?? ''
  const sanitizedReason = sanitizeText(reason) ?? ''

  if (!ALLOWED_CONTENT_TYPES.includes(contentType as AllowedContentType)) {
    throw new InvalidContentTypeError()
  }

  const exists = await contentExists(contentType as AllowedContentType, sanitizedContentId)
  if (!exists) throw new ContentNotFoundError()

  const existing = await prisma.flaggedContent.findFirst({
    where: {
      reporterId: userId,
      contentType,
      contentId: sanitizedContentId,
      status: 'pending',
    },
    select: { id: true },
  })

  if (existing) throw new DuplicateFlagError()

  return prisma.flaggedContent.create({
    data: {
      reporterId: userId,
      contentType,
      contentId: sanitizedContentId,
      reason: sanitizedReason,
    },
    select: {
      id: true,
      contentType: true,
      contentId: true,
      reason: true,
      status: true,
      createdAt: true,
    },
  })
}

export async function resolveFlag(flagId: string, action: string, actorId: string) {
  if (!ALLOWED_ACTIONS.includes(action as ResolutionAction)) {
    throw new InvalidResolutionActionError()
  }

  const flag = await prisma.flaggedContent.findUnique({
    where: { id: flagId },
    select: { id: true, status: true },
  })

  if (!flag) throw new FlagNotFoundError()
  if (flag.status !== 'pending') throw new FlagAlreadyResolvedError()

  return prisma.flaggedContent.update({
    where: { id: flagId },
    data: {
      status: action === 'dismiss' ? 'dismissed' : 'resolved',
      resolvedBy: actorId,
      resolution: action,
      resolvedAt: new Date(),
    },
  })
}

export async function listFlaggedContent(status?: string, limit = 100) {
  const flags = await prisma.flaggedContent.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return { flags }
}
