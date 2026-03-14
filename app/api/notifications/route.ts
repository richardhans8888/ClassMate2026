import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/notifications?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })
    return NextResponse.json({ notifications })
  } catch (err) {
    console.error('[GET /api/notifications]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/notifications — mark as read
export async function PATCH(req: NextRequest) {
  const { userId, notificationId, markAllRead } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId },
        data: { isRead: true },
      })
    } else if (notificationId) {
      await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
      })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/notifications]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/notifications?notificationId=xxx&userId=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const notificationId = searchParams.get('notificationId')
  const userId = searchParams.get('userId')

  if (!notificationId || !userId)
    return NextResponse.json({ error: 'notificationId and userId required' }, { status: 400 })

  try {
    await prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/notifications]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
