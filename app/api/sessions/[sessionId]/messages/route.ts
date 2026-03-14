// app/api/sessions/[sessionId]/messages/route.ts
// Fetch messages for a specific session

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await context.params
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, role: true, content: true, createdAt: true },
    })

    return NextResponse.json({ messages })
  } catch (err) {
    console.error('[GET /api/sessions/[sessionId]/messages]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
