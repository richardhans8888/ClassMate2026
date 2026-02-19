"use client";

import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseChatOptions {
  sessionId?: string;
  userId?: string;
}

export function useChat({ sessionId, userId }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      const assistantMessageId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            sessionId,
            userId,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to get response');
        }

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          console.log('RAW CHUNK:', buffer);
          const lines = buffer.split('\n');

          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);

              // OpenRouter / OpenAI format: choices[0].delta.content
              const text =
                parsed.choices?.[0]?.delta?.content ||
                parsed.text ||
                '';

              if (text) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + text }
                      : msg
                  )
                );
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, sessionId, userId, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}