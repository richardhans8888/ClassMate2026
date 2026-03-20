import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface ConversationSummary {
  userId: string
  lastMessage: {
    id: string
    content: string
    createdAt: Date
    senderId: string
  }
  unreadCount: number
}

// GET /api/messages/conversations
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recentMessages = await prisma.chatMessage.findMany({
      where: {
        OR: [{ senderId: session.id }, { recipientId: session.id }],
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        senderId: true,
        recipientId: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    })

    const byCounterpart = new Map<string, ConversationSummary>()

    for (const message of recentMessages) {
      const counterpartId = message.senderId === session.id ? message.recipientId : message.senderId

      const existing = byCounterpart.get(counterpartId)
      if (!existing) {
        byCounterpart.set(counterpartId, {
          userId: counterpartId,
          lastMessage: {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            senderId: message.senderId,
          },
          unreadCount:
            message.recipientId === session.id &&
            message.senderId === counterpartId &&
            !message.isRead
              ? 1
              : 0,
        })
        continue
      }

      if (
        message.recipientId === session.id &&
        message.senderId === counterpartId &&
        !message.isRead
      ) {
        existing.unreadCount += 1
      }
    }

    const counterpartIds = [...byCounterpart.keys()]

    if (counterpartIds.length === 0) {
      return NextResponse.json({ conversations: [] })
    }

    const counterpartUsers = await prisma.user.findMany({
      where: { id: { in: counterpartIds } },
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

    const userMap = new Map(counterpartUsers.map((user) => [user.id, user]))

    const conversations = counterpartIds
      .map((userId) => {
        const summary = byCounterpart.get(userId)
        const user = userMap.get(userId)
        if (!summary || !user) return null

        return {
          userId,
          participant: {
            id: user.id,
            email: user.email,
            displayName: user.profile?.displayName ?? null,
            avatarUrl: user.profile?.avatarUrl ?? null,
          },
          lastMessage: summary.lastMessage,
          unreadCount: summary.unreadCount,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      )

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('[GET /api/messages/conversations]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
