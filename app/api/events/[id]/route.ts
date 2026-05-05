import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { canModerate } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/sanitize'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import { updateEventSchema } from '@/lib/schemas'
import { zodErrorToString } from '@/lib/errors'

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

    const parsed = updateEventSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorToString(parsed.error) }, { status: 400 })
    }
    const body = parsed.data

    const data: {
      title?: string
      description?: string | null
      date?: Date
      startTime?: string | null
      endTime?: string | null
      category?: string | null
    } = {}

    if (body.title !== undefined) {
      const title = sanitizeText(body.title)
      if (!title) {
        return NextResponse.json({ error: 'title must contain valid text' }, { status: 400 })
      }
      data.title = title
    }

    if (body.date !== undefined) {
      const parsedDate = new Date(body.date)
      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
      }
      data.date = parsedDate
    }

    if (body.description !== undefined) data.description = body.description
    if (body.category !== undefined) data.category = body.category
    if (body.startTime !== undefined) data.startTime = body.startTime
    if (body.endTime !== undefined) data.endTime = body.endTime

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
