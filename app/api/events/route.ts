import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/sanitize'
import { checkRateLimit, generalLimiter, writeLimiter } from '@/lib/rate-limit'
import { getErrorResponse, zodErrorToString } from '@/lib/errors'
import { createEventSchema } from '@/lib/schemas'

function parseEventDate(rawDate: string): Date | null {
  const parsedDate = new Date(rawDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }
  return parsedDate
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (!value) return null
  const cleaned = sanitizeText(value)
  return cleaned || null
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, generalLimiter)
    if (limited) return limited

    const events = await prisma.event.findMany({
      where: { userId: session.id },
      orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
    })

    return NextResponse.json({ events }, { status: 200 })
  } catch (error: unknown) {
    console.error('Events GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const parsed = createEventSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorToString(parsed.error) }, { status: 400 })
    }
    const body = parsed.data

    const sanitizedTitle = sanitizeText(body.title)
    if (!sanitizedTitle) {
      return NextResponse.json({ error: 'title must contain valid text' }, { status: 400 })
    }

    const parsedDate = parseEventDate(body.date)
    if (!parsedDate) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
    }

    const startTime = normalizeOptionalText(body.startTime)
    const endTime = normalizeOptionalText(body.endTime)

    if ((startTime && !endTime) || (!startTime && endTime)) {
      return NextResponse.json(
        { error: 'startTime and endTime must both be provided together' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        userId: session.id,
        title: sanitizedTitle,
        description: normalizeOptionalText(body.description),
        date: parsedDate,
        startTime,
        endTime,
        category: normalizeOptionalText(body.category),
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error: unknown) {
    console.error('Events POST error:', error)
    const { message, status } = getErrorResponse(error)
    return NextResponse.json({ error: message }, { status })
  }
}
