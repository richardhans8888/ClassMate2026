"use client";

import { useEffect, useRef } from "react";
import { ChatInterface } from "@/components/features/ai-tutor/ChatInterface";
import { VoiceMode } from "@/components/features/ai-tutor/VoiceMode";
import { useChat } from "../../../hooks/useChat";
import { useVoice } from "../../../hooks/useVoice";

export default function AITutorPage() {
  const { messages, isLoading, error, sendMessage } = useChat();
  const lastSpokenIdRef = useRef<string | null>(null);

  const {
    isListening,
    isSpeaking,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice({
    onTranscript: (text) => {
      sendMessage(text);
    },
  });

  // Auto-speak every new AI response when done streaming
  useEffect(() => {
    if (isLoading) return;
    const lastAiMessage = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!lastAiMessage) return;
    if (lastAiMessage.id === lastSpokenIdRef.current) return;
    lastSpokenIdRef.current = lastAiMessage.id;
    speak(lastAiMessage.content);
  }, [messages, isLoading]);

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-50 dark:bg-[#05050A] p-4 lg:p-6 overflow-hidden transition-colors duration-300">
      <div className="h-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          error={error}
          sendMessage={sendMessage}
        />
        <VoiceMode
          messages={messages}
          isListening={isListening}
          isSpeaking={isSpeaking}
          isSupported={isSupported}
          startListening={startListening}
          stopListening={stopListening}
          speak={speak}
          stopSpeaking={stopSpeaking}
        />
      </div>

      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 dark:bg-purple-900/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 dark:bg-indigo-900/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>
    </div>
  );
}
