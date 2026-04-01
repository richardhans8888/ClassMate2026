// app/api/chat/__tests__/route.test.ts
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/chat/route'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

jest.mock('@/lib/prisma')
jest.mock('@/lib/auth', () => ({ getSession: jest.fn() }))
jest.mock('@/lib/moderation', () => ({
  moderateContent: jest.fn().mockResolvedValue({
    safe: true,
    toxicity_score: 0,
    spam_score: 0,
    categories: [],
    action: 'approve',
    reason: 'Safe content',
  }),
}))

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>
const mockFetch = jest.spyOn(global, 'fetch')

const AUTHED_USER = { id: 'user-1', email: 'user@test.com', name: 'Test User', image: null }

afterEach(() => {
  jest.clearAllMocks()
})

// Helper: build a minimal Groq SSE stream response
function makeGroqStream(content = 'Hi') {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`data: {"choices":[{"delta":{"content":"${content}"}}]}\n\n`)
      )
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

describe('POST /api/chat', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValueOnce(null)
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 when messages field is missing', async () => {
    mockGetSession.mockResolvedValueOnce(AUTHED_USER)
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ sessionId: 'session-1' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 when messages is an empty array', async () => {
    mockGetSession.mockResolvedValueOnce(AUTHED_USER)
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [] }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 404 when a provided sessionId does not belong to the user', async () => {
    mockGetSession.mockResolvedValueOnce(AUTHED_USER)
    ;(prisma.chatSession.findFirst as jest.Mock).mockResolvedValueOnce(null)

    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        sessionId: 'someone-elses-session',
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(404)
  })

  it('auto-creates a session when no sessionId is provided', async () => {
    mockGetSession.mockResolvedValueOnce(AUTHED_USER)
    ;(prisma.chatSession.create as jest.Mock).mockResolvedValueOnce({ id: 'new-session-id' })
    ;(prisma.chatMessage.create as jest.Mock).mockResolvedValue({ id: 'msg-id' })
    ;(prisma.chatSession.update as jest.Mock).mockResolvedValue({})
    mockFetch.mockResolvedValueOnce(makeGroqStream())

    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(prisma.chatSession.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1' }) })
    )
    // Session ID returned in header
    expect(res.headers.get('X-Session-Id')).toBe('new-session-id')
  })

  it('saves user message before streaming and includes X-Session-Id header', async () => {
    mockGetSession.mockResolvedValueOnce(AUTHED_USER)
    ;(prisma.chatSession.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 'existing-session',
      userId: 'user-1',
    })
    ;(prisma.chatMessage.create as jest.Mock).mockResolvedValue({ id: 'msg-id' })
    ;(prisma.chatSession.update as jest.Mock).mockResolvedValue({})
    mockFetch.mockResolvedValueOnce(makeGroqStream('Hello back'))

    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        sessionId: 'existing-session',
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/event-stream')
    expect(res.headers.get('X-Session-Id')).toBe('existing-session')

    // User message saved first (before Groq stream)
    expect(prisma.chatMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          senderId: 'user-1',
          sessionId: 'existing-session',
          content: 'Hello',
          role: 'user',
        }),
      })
    )
  })

  it('calls Groq API with sanitized messages', async () => {
    mockGetSession.mockResolvedValueOnce(AUTHED_USER)
    ;(prisma.chatSession.create as jest.Mock).mockResolvedValueOnce({ id: 'session-x' })
    ;(prisma.chatMessage.create as jest.Mock).mockResolvedValue({ id: 'msg-id' })
    ;(prisma.chatSession.update as jest.Mock).mockResolvedValue({})
    mockFetch.mockResolvedValueOnce(makeGroqStream())

    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    await POST(req)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('groq.com'),
      expect.objectContaining({ method: 'POST' })
    )
  })
})
