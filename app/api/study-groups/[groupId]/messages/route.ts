import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeMarkdown } from '@/lib/sanitize'

// GET /api/study-groups/[groupId]/messages
export async function GET(req: NextRequest, context: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await context.params

  try {
    const messages = await prisma.chatMessage.findMany({
      where: { messageType: `group:${groupId}` },
      orderBy: { createdAt: 'asc' },
      take: 100,
      include: {
        sender: {
          include: { profile: true },
        },
      },
    })
    return NextResponse.json({ messages })
  } catch (err) {
    console.error('[GET /api/study-groups/[groupId]/messages]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/study-groups/[groupId]/messages — send a message
export async function POST(req: NextRequest, context: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await context.params
  const { userId, content } = await req.json()
  if (!userId || !content)
    return NextResponse.json({ error: 'userId and content required' }, { status: 400 })

  const sanitizedContent = sanitizeMarkdown(content)
  if (!sanitizedContent)
    return NextResponse.json({ error: 'content must contain valid text' }, { status: 400 })

  try {
    const member = await prisma.studyGroupMember.findFirst({
      where: { groupId, userId },
    })

    if (!member)
      return NextResponse.json({ error: 'You are not a member of this group' }, { status: 403 })

    const message = await prisma.chatMessage.create({
      data: {
        senderId: userId,
        recipientId: userId,
        content: sanitizedContent,
        messageType: `group:${groupId}`,
        role: 'user',
      },
      include: {
        sender: { include: { profile: true } },
      },
    })

    return NextResponse.json({ message })
  } catch (err) {
    console.error('[POST /api/study-groups/[groupId]/messages]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
