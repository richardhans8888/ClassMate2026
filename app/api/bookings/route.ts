import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/bookings?userId=xxx&role=student|tutor
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const role = searchParams.get('role') || 'student'
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    let bookings

    if (role === 'tutor') {
      const tutorRecord = await prisma.tutor.findUnique({ where: { userId } })
      if (!tutorRecord) return NextResponse.json({ bookings: [] })

      bookings = await prisma.booking.findMany({
        where: { tutorId: tutorRecord.id },
        include: {
          tutor: { include: { user: { include: { profile: true } } } },
          student: { include: { profile: true } },
        },
        orderBy: { scheduledAt: 'asc' },
      })
    } else {
      bookings = await prisma.booking.findMany({
        where: { studentId: userId },
        include: {
          tutor: { include: { user: { include: { profile: true } } } },
          student: { include: { profile: true } },
        },
        orderBy: { scheduledAt: 'asc' },
      })
    }

    return NextResponse.json({ bookings })
  } catch (err) {
    console.error('[GET /api/bookings]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/bookings — create a booking
export async function POST(req: NextRequest) {
  const { tutorId, studentId, subject, scheduledAt, durationMinutes, notes } = await req.json()
  if (!tutorId || !studentId || !subject || !scheduledAt)
    return NextResponse.json(
      { error: 'tutorId, studentId, subject, scheduledAt required' },
      { status: 400 }
    )

  try {
    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
      include: { user: true },
    })

    if (!tutor) return NextResponse.json({ error: 'Tutor not found' }, { status: 404 })

    const duration = durationMinutes || 60
    const totalPrice = (duration / 60) * tutor.hourlyRate

    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          tutorId,
          studentId,
          subject,
          scheduledAt: new Date(scheduledAt),
          durationMinutes: duration,
          hourlyRate: tutor.hourlyRate,
          totalPrice,
          notes: notes ?? null,
        },
      })

      // Notify tutor of new booking
      await tx.notification.create({
        data: {
          userId: tutor.userId,
          type: 'BOOKING_CONFIRMED',
          title: 'New Booking Request',
          message: `You have a new booking request for ${subject}`,
          referenceId: newBooking.id,
          referenceType: 'booking',
        },
      })

      // Award XP to student for booking a session
      await tx.user.update({
        where: { id: studentId },
        data: { xp: { increment: 50 } },
      })
      await tx.pointTransaction.create({
        data: {
          userId: studentId,
          actionType: 'BOOKING_CREATED',
          points: 50,
          description: 'Booked a tutor session',
        },
      })

      return newBooking
    })

    return NextResponse.json({ booking })
  } catch (err) {
    console.error('[POST /api/bookings]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/bookings — update booking status
export async function PATCH(req: NextRequest) {
  const { bookingId, status, userId } = await req.json()
  if (!bookingId || !status)
    return NextResponse.json({ error: 'bookingId and status required' }, { status: 400 })

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status },
      })

      // Notify student of status change
      if (updated.studentId && status !== 'PENDING') {
        await tx.notification.create({
          data: {
            userId: updated.studentId,
            type: 'BOOKING_CONFIRMED',
            title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}`,
            message: `Your booking has been ${status.toLowerCase()}`,
            referenceId: bookingId,
            referenceType: 'booking',
          },
        })
      }

      // Award XP when session is completed
      if (status === 'COMPLETED') {
        await tx.user.update({
          where: { id: updated.studentId },
          data: { xp: { increment: 100 } },
        })
        await tx.pointTransaction.create({
          data: {
            userId: updated.studentId,
            actionType: 'BOOKING_SESSION_COMPLETED',
            points: 100,
            description: 'Completed a tutoring session',
          },
        })

        if (userId) {
          await tx.user.update({
            where: { id: userId },
            data: { xp: { increment: 75 } },
          })
          await tx.pointTransaction.create({
            data: {
              userId,
              actionType: 'TUTOR_SESSION_REWARDED',
              points: 75,
              description: 'Completed a tutoring session as tutor',
            },
          })
        }
      }

      return updated
    })

    return NextResponse.json({ booking })
  } catch (err) {
    console.error('[PATCH /api/bookings]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
