import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { canModerate } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/sanitize'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'

type UpdateEventPayload = {
  title?: unknown
  description?: unknown
  date?: unknown
  startTime?: unknown
  endTime?: unknown
  category?: unknown
}

function parseDate(rawDate: unknown): Date | null {
  if (typeof rawDate !== 'string') {
    return null
  }
  const parsedDate = new Date(rawDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }
  return parsedDate
}

function parseOptionalText(rawValue: unknown): string | null | undefined {
  if (rawValue === undefined) {
    return undefined
  }
  if (rawValue === null) {
    return null
  }
  if (typeof rawValue !== 'string') {
    return undefined
  }
  const cleaned = sanitizeText(rawValue)
  return cleaned || null
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const { id } = await params

    const existingEvent = await prisma.event.findUnique({
      where: { id },
      select: { id: true, userId: true },
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const authorized = await canModerate(session, existingEvent.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to update this event' }, { status: 403 })
    }

    const body = (await request.json()) as UpdateEventPayload
    const data: {
      title?: string
      description?: string | null
      date?: Date
      startTime?: string | null
      endTime?: string | null
      category?: string | null
    } = {}

    if (body.title !== undefined) {
      if (typeof body.title !== 'string') {
        return NextResponse.json({ error: 'title must be a string' }, { status: 400 })
      }
      const title = sanitizeText(body.title)
      if (!title) {
        return NextResponse.json({ error: 'title must contain valid text' }, { status: 400 })
      }
      data.title = title
    }

    if (body.date !== undefined) {
      const parsedDate = parseDate(body.date)
      if (!parsedDate) {
        return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
      }
      data.date = parsedDate
    }

    const description = parseOptionalText(body.description)
    if (description !== undefined) {
      data.description = description
    }

    const category = parseOptionalText(body.category)
    if (category !== undefined) {
      data.category = category
    }

    const startTime = parseOptionalText(body.startTime)
    if (startTime !== undefined) {
      data.startTime = startTime
    }

    const endTime = parseOptionalText(body.endTime)
    if (endTime !== undefined) {
      data.endTime = endTime
    }

    const hasStartTimeField = body.startTime !== undefined
    const hasEndTimeField = body.endTime !== undefined
    if (hasStartTimeField !== hasEndTimeField) {
      return NextResponse.json(
        { error: 'startTime and endTime must both be provided together' },
        { status: 400 }
      )
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const event = await prisma.event.update({
      where: { id },
      data,
    })

    return NextResponse.json({ event }, { status: 200 })
  } catch (error: unknown) {
    console.error('Events PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const { id } = await params

    const existingEvent = await prisma.event.findUnique({
      where: { id },
      select: { id: true, userId: true },
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const authorized = await canModerate(session, existingEvent.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to delete this event' }, { status: 403 })
    }

    await prisma.event.delete({ where: { id } })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    console.error('Events DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
