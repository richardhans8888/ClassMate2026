import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { thread } = await req.json()

    if (!thread || typeof thread !== 'string') {
      return NextResponse.json({ error: 'thread content required' }, { status: 400 })
    }

    // Use Groq to summarize discussion thread
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are a discussion summarizer for a student community platform. Summarize the provided thread in 2-3 clear, concise sentences. Focus on the main topic, key points discussed, and any conclusions or questions raised. Be objective and factual.',
          },
          {
            role: 'user',
            content: `Summarize this discussion thread:\n\n${thread}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Groq API error: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const summary = data.choices[0]?.message?.content

    if (!summary) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    return NextResponse.json({ summary }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
