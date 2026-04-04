import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeMarkdown } from '@/lib/sanitize'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 100

function parseLimit(input: string | null): number {
  if (!input) return DEFAULT_LIMIT
  const value = Number.parseInt(input, 10)
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_LIMIT
  return Math.min(value, MAX_LIMIT)
}

// GET /api/messages/conversations/[userId]?limit=50&cursor=ISO_DATE
export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    if (userId === session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get('limit'))
    const cursor = searchParams.get('cursor')

    const cursorDate = cursor ? new Date(cursor) : null
    if (cursor && (!cursorDate || Number.isNaN(cursorDate.getTime()))) {
      return NextResponse.json({ error: 'Invalid cursor value' }, { status: 400 })
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        AND: [
          {
            OR: [
              { senderId: session.id, recipientId: userId },
              { senderId: userId, recipientId: session.id },
            ],
          },
          cursorDate ? { createdAt: { lt: cursorDate } } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        senderId: true,
        recipientId: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    })

    const ordered = [...messages].reverse()
    const nextCursor =
      messages.length === limit && messages.at(-1)
        ? (messages.at(-1)?.createdAt.toISOString() ?? null)
        : null

    return NextResponse.json({
      participant: {
        id: targetUser.id,
        email: targetUser.email,
        displayName: targetUser.profile?.displayName ?? null,
        avatarUrl: targetUser.profile?.avatarUrl ?? null,
      },
      messages: ordered,
      pagination: {
        limit,
        nextCursor,
      },
    })
  } catch (error) {
    console.error('[GET /api/messages/conversations/[userId]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/messages/conversations/[userId]
export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const { userId } = await params
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    if (userId === session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
    }

    const body = (await request.json()) as { content?: string }
    const content = typeof body.content === 'string' ? body.content : ''
    const sanitizedContent = sanitizeMarkdown(content).trim()

    if (!sanitizedContent) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    const message = await prisma.chatMessage.create({
      data: {
        senderId: session.id,
        recipientId: userId,
        content: sanitizedContent,
        role: 'user',
        messageType: 'text',
        isRead: false,
      },
      select: {
        id: true,
        senderId: true,
        recipientId: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/messages/conversations/[userId]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
