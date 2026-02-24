// src/app/api/voice/tts/route.ts
// Text-to-Speech using ElevenLabs free tier (10,000 chars/month)
// Fallback: Web Speech API (browser-native, completely free)

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, useElevenLabs } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  // Only use ElevenLabs if explicitly requested and API key exists
  if (useElevenLabs && process.env.ELEVENLABS_API_KEY) {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, // Free "Rachel" voice
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.slice(0, 500), // Limit to save quota
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        },
      );

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        return new Response(audioBuffer, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch (error) {
      console.error("ElevenLabs TTS error, falling back to browser:", error);
    }
  }

  // Fallback: tell client to use browser's Web Speech API
  return NextResponse.json({
    useBrowserTTS: true,
    text,
    message: "Use window.speechSynthesis on the client side",
  });
}
