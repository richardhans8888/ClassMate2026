import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/messages/conversations/[userId]/read
export async function POST(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
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
      return NextResponse.json({ error: 'Cannot mark self-thread as read' }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
    }

    const result = await prisma.chatMessage.updateMany({
      where: {
        senderId: userId,
        recipientId: session.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return NextResponse.json({ updatedCount: result.count })
  } catch (error) {
    console.error('[POST /api/messages/conversations/[userId]/read]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
