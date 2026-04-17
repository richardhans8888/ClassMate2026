import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/sanitize'
import { ALLOWED_CONTENT_TYPES, type AllowedContentType } from '@/lib/content-exists'
import { FlagStatus, ModerationTargetType } from '@/generated/prisma/enums'

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

export class SelfFlagError extends Error {
  constructor() {
    super('You cannot flag your own content')
    this.name = 'SelfFlagError'
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

const ALLOWED_ACTIONS = ['dismiss', 'remove'] as const
type ResolutionAction = (typeof ALLOWED_ACTIONS)[number]

export class InvalidResolutionActionError extends Error {
  constructor() {
    super(`action must be one of: ${ALLOWED_ACTIONS.join(', ')}`)
    this.name = 'InvalidResolutionActionError'
  }
}

// --- Private helpers ---

async function getContentAuthorId(
  contentType: AllowedContentType,
  contentId: string
): Promise<string | null> {
  if (contentType === 'post') {
    const post = await prisma.forumPost.findUnique({
      where: { id: contentId },
      select: { userId: true },
    })
    return post?.userId ?? null
  }

  if (contentType === 'reply') {
    const reply = await prisma.forumReply.findUnique({
      where: { id: contentId },
      select: { userId: true },
    })
    return reply?.userId ?? null
  }

  if (contentType === 'material') {
    const material = await prisma.studyMaterial.findUnique({
      where: { id: contentId },
      select: { userId: true },
    })
    return material?.userId ?? null
  }

  return null
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

  const authorId = await getContentAuthorId(contentType as AllowedContentType, sanitizedContentId)
  if (authorId === null) throw new ContentNotFoundError()
  if (authorId === userId) throw new SelfFlagError()

  const existing = await prisma.flaggedContent.findFirst({
    where: {
      reporterId: userId,
      contentType,
      contentId: sanitizedContentId,
      status: FlagStatus.pending,
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

export async function resolveFlag(
  flagId: string,
  action: string,
  actorId: string,
  reason?: string
) {
  if (!ALLOWED_ACTIONS.includes(action as ResolutionAction)) {
    throw new InvalidResolutionActionError()
  }

  return prisma.$transaction(async (tx) => {
    const flag = await tx.flaggedContent.findUnique({
      where: { id: flagId },
      select: { id: true, status: true },
    })

    if (!flag) throw new FlagNotFoundError()
    if (flag.status !== FlagStatus.pending) throw new FlagAlreadyResolvedError()

    const updated = await tx.flaggedContent.update({
      where: { id: flagId },
      data: {
        status: action === 'dismiss' ? FlagStatus.dismissed : FlagStatus.resolved,
        resolvedBy: actorId,
        resolution: action,
        resolvedAt: new Date(),
      },
    })

    await tx.moderationLog.create({
      data: {
        actorId,
        action: 'FLAG_RESOLVED',
        targetId: flagId,
        targetType: ModerationTargetType.FlaggedContent,
        reason: reason ?? null,
        metadata: JSON.stringify({ resolution: action }),
      },
    })

    return updated
  })
}

export async function listFlaggedContent(status?: string, limit = 100) {
  const flags = await prisma.flaggedContent.findMany({
    where: status ? { status: status as FlagStatus } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return { flags }
}
