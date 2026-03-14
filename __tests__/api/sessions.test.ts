import { NextRequest } from 'next/server'
import { GET, POST, DELETE } from '@/app/api/sessions/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma')

afterEach(() => {
  jest.clearAllMocks()
})

// ─── GET /api/sessions ────────────────────────────────────────────────────────

describe('GET /api/sessions', () => {
  it('returns 400 when userId query param is missing', async () => {
    const req = new NextRequest('http://localhost/api/sessions')
    const res = await GET(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/userId/i)
  })

  it('returns 200 with sessions array for a valid userId', async () => {
    const mockSessions = [
      {
        id: 'session-1',
        userId: 'user-1',
        title: 'Calculus Help',
        subject: 'Mathematics',
        updatedAt: new Date(),
        _count: { messages: 5 },
      },
    ]
    ;(prisma.chatSession.findMany as jest.Mock).mockResolvedValueOnce(mockSessions)

    const req = new NextRequest('http://localhost/api/sessions?userId=user-1')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('sessions')
    expect(Array.isArray(body.sessions)).toBe(true)
    expect(body.sessions).toHaveLength(1)
    expect(body.sessions[0].id).toBe('session-1')
  })

  it('returns an empty sessions array when the user has no sessions', async () => {
    ;(prisma.chatSession.findMany as jest.Mock).mockResolvedValueOnce([])

    const req = new NextRequest('http://localhost/api/sessions?userId=user-no-sessions')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.sessions).toHaveLength(0)
  })
})

// ─── POST /api/sessions ───────────────────────────────────────────────────────

describe('POST /api/sessions', () => {
  it('returns 400 when userId is missing from the body', async () => {
    const req = new NextRequest('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', subject: 'CS' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/userId/i)
  })

  it('returns 200 and creates a session with default title when title is omitted', async () => {
    const mockSession = {
      id: 'new-session-id',
      userId: 'user-1',
      title: 'New Session',
      subject: 'General',
    }
    ;(prisma.chatSession.create as jest.Mock).mockResolvedValueOnce(mockSession)

    const req = new NextRequest('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-1' }), // no title or subject
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('session')
    expect(body.session.id).toBe('new-session-id')
    // Route defaults to 'New Session' when title is omitted
    expect(prisma.chatSession.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ title: 'New Session', subject: 'General' }),
      })
    )
  })

  it('returns 200 and creates a session with the provided title and subject', async () => {
    const mockSession = {
      id: 'session-cs',
      userId: 'user-1',
      title: 'Data Structures Q&A',
      subject: 'Computer Science',
    }
    ;(prisma.chatSession.create as jest.Mock).mockResolvedValueOnce(mockSession)

    const req = new NextRequest('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-1',
        title: 'Data Structures Q&A',
        subject: 'Computer Science',
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.session.title).toBe('Data Structures Q&A')
  })
})

// ─── DELETE /api/sessions ─────────────────────────────────────────────────────

describe('DELETE /api/sessions', () => {
  it('returns 400 when sessionId query param is missing', async () => {
    const req = new NextRequest('http://localhost/api/sessions?userId=user-1')
    const res = await DELETE(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/sessionId/i)
  })

  it('returns 400 when userId query param is missing', async () => {
    const req = new NextRequest('http://localhost/api/sessions?sessionId=session-1')
    const res = await DELETE(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/userId/i)
  })

  it('returns 200 and deletes messages before deleting the session', async () => {
    ;(prisma.chatMessage.deleteMany as jest.Mock).mockResolvedValueOnce({ count: 3 })
    ;(prisma.chatSession.deleteMany as jest.Mock).mockResolvedValueOnce({ count: 1 })

    const req = new NextRequest('http://localhost/api/sessions?sessionId=session-1&userId=user-1')
    const res = await DELETE(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)

    // Messages must be deleted before the session (foreign key order)
    const deleteManyCallOrder = [
      (prisma.chatMessage.deleteMany as jest.Mock).mock.invocationCallOrder[0],
      (prisma.chatSession.deleteMany as jest.Mock).mock.invocationCallOrder[0],
    ]
    expect(deleteManyCallOrder[0]).toBeLessThan(deleteManyCallOrder[1])
  })
})
