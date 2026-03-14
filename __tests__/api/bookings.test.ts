// app/api/bookings/__tests__/route.test.ts
import { NextRequest } from 'next/server'
import { GET, POST, PATCH } from '@/app/api/bookings/route'

// Mock Prisma to prevent real DB calls
jest.mock('@/lib/prisma')

afterEach(() => {
  jest.clearAllMocks()
})

const validBody = {
  tutorId: 'tutor-1',
  studentId: 'user-1',
  subject: 'Mathematics',
  scheduledAt: '2026-04-01T10:00:00.000Z',
  durationMinutes: 60,
}

describe('GET /api/bookings', () => {
  it('returns 400 when userId query param is missing', async () => {
    const req = new NextRequest(
      'http://localhost/api/bookings?role=student'
      // userId intentionally omitted
    )
    const res = await GET(req)

    expect(res.status).toBe(400)
  })
})

describe('POST /api/bookings', () => {
  it('returns 400 when tutorId is missing', async () => {
    const req = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        studentId: validBody.studentId,
        subject: validBody.subject,
        scheduledAt: validBody.scheduledAt,
        durationMinutes: validBody.durationMinutes,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when studentId is missing', async () => {
    const req = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        tutorId: validBody.tutorId,
        subject: validBody.subject,
        scheduledAt: validBody.scheduledAt,
        durationMinutes: validBody.durationMinutes,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when subject is missing', async () => {
    const req = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        tutorId: validBody.tutorId,
        studentId: validBody.studentId,
        scheduledAt: validBody.scheduledAt,
        durationMinutes: validBody.durationMinutes,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when scheduledAt is missing', async () => {
    const req = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        tutorId: validBody.tutorId,
        studentId: validBody.studentId,
        subject: validBody.subject,
        durationMinutes: validBody.durationMinutes,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/bookings', () => {
  it('returns 400 when bookingId is missing from request body', async () => {
    const req = new NextRequest('http://localhost/api/bookings', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'confirmed' }), // no bookingId
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req)

    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string }
    expect(body.error).toMatch(/bookingId/i)
  })

  it('returns 400 when status is missing from request body', async () => {
    const req = new NextRequest('http://localhost/api/bookings', {
      method: 'PATCH',
      body: JSON.stringify({ bookingId: 'booking-1' }), // no status
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req)

    expect(res.status).toBe(400)
  })
})
