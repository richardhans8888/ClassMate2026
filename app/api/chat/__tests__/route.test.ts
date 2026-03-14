// app/api/chat/__tests__/route.test.ts
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/chat/route'

// The chat route calls global.fetch directly — mock it
const mockFetch = jest.spyOn(global, 'fetch')

afterEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/chat', () => {
  it('returns 400 when messages field is missing', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ sessionId: 'session-1' }), // no messages
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when messages is an empty array', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [] }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('calls global.fetch when messages array is valid', async () => {
    // Mock a minimal SSE stream response from Groq
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n'))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    mockFetch.mockResolvedValueOnce(
      new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      })
    )

    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('groq.com'),
      expect.objectContaining({ method: 'POST' })
    )
    expect(res.status).toBe(200)
  })
})
