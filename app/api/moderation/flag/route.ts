import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/sanitize'
import { ALLOWED_CONTENT_TYPES, contentExists, type AllowedContentType } from '@/lib/content-exists'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as {
      contentType?: string
      contentId?: string
      reason?: string
    }

    const contentType = body.contentType
    const contentId = sanitizeText(body.contentId)
    const reason = sanitizeText(body.reason)

    if (!contentType || !contentId || !reason) {
      return NextResponse.json(
        { error: 'contentType, contentId, and reason are required' },
        { status: 400 }
      )
    }

    if (!ALLOWED_CONTENT_TYPES.includes(contentType as AllowedContentType)) {
      return NextResponse.json(
        { error: `contentType must be one of: ${ALLOWED_CONTENT_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const exists = await contentExists(contentType as AllowedContentType, contentId)
    if (!exists) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    const existing = await prisma.flaggedContent.findFirst({
      where: {
        reporterId: session.id,
        contentType,
        contentId,
        status: 'pending',
      },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json({ error: 'Content already flagged by this user' }, { status: 409 })
    }

    const flag = await prisma.flaggedContent.create({
      data: {
        reporterId: session.id,
        contentType,
        contentId,
        reason,
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

    return NextResponse.json({ flag }, { status: 201 })
  } catch (error: unknown) {
    console.error('Flag content error:', error)
    const message = error instanceof Error ? error.message : 'Failed to flag content'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
