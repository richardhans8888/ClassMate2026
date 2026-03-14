import { NextRequest } from 'next/server'
import { POST } from '@/app/api/voice/tts/route'

const mockFetch = jest.spyOn(global, 'fetch')

afterEach(() => {
  jest.clearAllMocks()
  delete process.env.ELEVENLABS_API_KEY
})

// ─── POST /api/voice/tts ──────────────────────────────────────────────────────

describe('POST /api/voice/tts', () => {
  it('returns 400 when text field is missing from the body', async () => {
    const req = new NextRequest('http://localhost/api/voice/tts', {
      method: 'POST',
      body: JSON.stringify({ useElevenLabs: false }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/text/i)
  })

  it('returns 200 with useBrowserTTS:true when useElevenLabs is false', async () => {
    const req = new NextRequest('http://localhost/api/voice/tts', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hello ClassMate', useElevenLabs: false }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.useBrowserTTS).toBe(true)
    expect(body.text).toBe('Hello ClassMate')
    // ElevenLabs should not be called at all
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('falls back to browser TTS when ELEVENLABS_API_KEY is not set', async () => {
    // No env var set — route must skip ElevenLabs and return browser fallback
    const req = new NextRequest('http://localhost/api/voice/tts', {
      method: 'POST',
      body: JSON.stringify({ text: 'Fallback test', useElevenLabs: true }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.useBrowserTTS).toBe(true)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns audio/mpeg binary when ElevenLabs responds successfully', async () => {
    process.env.ELEVENLABS_API_KEY = 'test-elevenlabs-key'
    const fakeAudio = new Uint8Array([0x49, 0x44, 0x33]).buffer
    mockFetch.mockResolvedValueOnce(
      new Response(fakeAudio, {
        status: 200,
        headers: { 'Content-Type': 'audio/mpeg' },
      })
    )

    const req = new NextRequest('http://localhost/api/voice/tts', {
      method: 'POST',
      body: JSON.stringify({ text: 'ElevenLabs test', useElevenLabs: true }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('audio/mpeg')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('elevenlabs.io'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('falls back to browser TTS when ElevenLabs API returns an error', async () => {
    process.env.ELEVENLABS_API_KEY = 'test-elevenlabs-key'
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'quota_exceeded' }), { status: 429 })
    )

    const req = new NextRequest('http://localhost/api/voice/tts', {
      method: 'POST',
      body: JSON.stringify({ text: 'Quota test', useElevenLabs: true }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    // Route catches non-ok ElevenLabs response and returns browser TTS fallback
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.useBrowserTTS).toBe(true)
  })
})
