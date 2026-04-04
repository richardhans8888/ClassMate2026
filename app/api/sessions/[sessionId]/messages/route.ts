// app/api/sessions/[sessionId]/messages/route.ts
// Fetch messages for a specific session

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { checkRateLimit, generalLimiter } from '@/lib/rate-limit'

export async function GET(_req: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = await checkRateLimit(session.id, generalLimiter)
  if (limited) return limited

  const { sessionId } = await context.params

  try {
    const chatSession = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId: session.id },
    })

    if (!chatSession) {
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
