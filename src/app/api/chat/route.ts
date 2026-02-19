import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: 'You are ClassMate, an expert AI tutor for university students. Explain concepts clearly, show code in markdown code blocks, and be encouraging.'
          },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        ],
        stream: true,
      }),
    });

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}