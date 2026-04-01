import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/sessions
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: session.id },
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
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { title, subject } = body as { title?: string; subject?: string }

  try {
    const chatSession = await prisma.chatSession.create({
      data: {
        userId: session.id,
        title: title || 'New Session',
        subject: subject || 'General',
      },
    })
    return NextResponse.json({ session: chatSession })
  } catch (err) {
    console.error('[POST /api/sessions]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/sessions?sessionId=xxx
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 })

  try {
    const chatSession = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId: session.id },
    })
    if (!chatSession) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

    await prisma.chatMessage.deleteMany({ where: { sessionId } })
    await prisma.chatSession.delete({ where: { id: sessionId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/sessions]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
