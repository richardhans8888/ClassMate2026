import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/sessions?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include: {
        _count: { select: { messages: true } },
      },
    })
    return NextResponse.json({ sessions })
  } catch (err) {
    console.error('[GET /api/sessions]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/sessions — create session
export async function POST(req: NextRequest) {
  const { userId, title, subject } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const session = await prisma.chatSession.create({
      data: {
        userId,
        title: title || 'New Session',
        subject: subject || 'General',
      },
    })
    return NextResponse.json({ session })
  } catch (err) {
    console.error('[POST /api/sessions]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/sessions?sessionId=xxx&userId=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  const userId = searchParams.get('userId')
  if (!sessionId || !userId)
    return NextResponse.json({ error: 'sessionId and userId required' }, { status: 400 })

  try {
    await prisma.chatMessage.deleteMany({ where: { sessionId } })
    await prisma.chatSession.deleteMany({ where: { id: sessionId, userId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/sessions]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
