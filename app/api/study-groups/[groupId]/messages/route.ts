import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

  try {
    const member = await prisma.studyGroupMember.findFirst({
      where: { groupId, userId },
    })

    if (!member)
      return NextResponse.json({ error: 'You are not a member of this group' }, { status: 403 })

    const message = await prisma.$transaction(async (tx) => {
      const newMessage = await tx.chatMessage.create({
        data: {
          senderId: userId,
          recipientId: userId,
          content,
          messageType: `group:${groupId}`,
          role: 'user',
        },
        include: {
          sender: { include: { profile: true } },
        },
      })

      await tx.user.update({
        where: { id: userId },
        data: { xp: { increment: 5 } },
      })
      await tx.pointTransaction.create({
        data: {
          userId,
          actionType: 'CHAT_STREAK',
          points: 5,
          description: 'Sent a message in study group',
        },
      })

      return newMessage
    })

    return NextResponse.json({ message })
  } catch (err) {
    console.error('[POST /api/study-groups/[groupId]/messages]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
