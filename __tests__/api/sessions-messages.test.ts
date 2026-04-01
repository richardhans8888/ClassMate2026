import { NextRequest } from 'next/server'
import { GET } from '@/app/api/sessions/[sessionId]/messages/route'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

jest.mock('@/lib/prisma')
jest.mock('@/lib/auth', () => ({ getSession: jest.fn() }))

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>

const AUTHED_USER = { id: 'user-1', email: 'user@test.com', name: 'Test User', image: null }

function makeContext(sessionId: string) {
  return { params: Promise.resolve({ sessionId }) }
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('GET /api/sessions/[sessionId]/messages', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValueOnce(null)
    const req = new NextRequest('http://localhost/api/sessions/session-1/messages')
    const res = await GET(req, makeContext('session-1'))
    expect(res.status).toBe(401)
  })

  it('returns 404 when session does not belong to the authenticated user', async () => {
    mockGetSession.mockResolvedValueOnce(AUTHED_USER)
    ;(prisma.chatSession.findFirst as jest.Mock).mockResolvedValueOnce(null)

    const req = new NextRequest('http://localhost/api/sessions/other-session/messages')
    const res = await GET(req, makeContext('other-session'))
    expect(res.status).toBe(404)
  })

  it('returns 200 with messages array for the authenticated user', async () => {
    mockGetSession.mockResolvedValueOnce(AUTHED_USER)
    ;(prisma.chatSession.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 'session-1',
      userId: 'user-1',
    })
    const mockMessages = [
      { id: 'msg-1', role: 'user', content: 'Hello', createdAt: new Date('2026-01-01') },
      { id: 'msg-2', role: 'assistant', content: 'Hi there!', createdAt: new Date('2026-01-01') },
    ]
    ;(prisma.chatMessage.findMany as jest.Mock).mockResolvedValueOnce(mockMessages)

    const req = new NextRequest('http://localhost/api/sessions/session-1/messages')
    const res = await GET(req, makeContext('session-1'))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('messages')
    expect(body.messages).toHaveLength(2)
    expect(body.messages[0].role).toBe('user')
    expect(body.messages[1].role).toBe('assistant')

    // Must verify ownership using the session's user ID
    expect(prisma.chatSession.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'session-1', userId: 'user-1' } })
    )
  })

  it('returns 200 with empty messages array for a session with no messages', async () => {
    mockGetSession.mockResolvedValueOnce(AUTHED_USER)
    ;(prisma.chatSession.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 'empty-session',
      userId: 'user-1',
    })
    ;(prisma.chatMessage.findMany as jest.Mock).mockResolvedValueOnce([])

    const req = new NextRequest('http://localhost/api/sessions/empty-session/messages')
    const res = await GET(req, makeContext('empty-session'))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.messages).toHaveLength(0)
  })
})
