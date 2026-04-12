'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Send, Image as ImageIcon, Plus, Bot, History } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Message } from '../../../hooks/useChat'

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
  isLoadingHistory?: boolean
  error: string | null
  sendMessage: (content: string) => void
  onNewChat?: () => void
  onOpenSessions?: () => void
}

export function ChatInterface({
  messages,
  isLoading,
  isLoadingHistory = false,
  error,
  sendMessage,
  onNewChat,
  onOpenSessions,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const chatBoxRef = useRef<HTMLDivElement>(null)

  // Auto-scroll only the chat box
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    const text = input
    setInput('')
    sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const parseContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts: (
      | { type: 'text'; content: string }
      | { type: 'code'; content: string; language: string }
    )[] = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index),
        })
      }
      parts.push({
        type: 'code',
        language: (match[1] ?? 'code') as string,
        content: (match[2] ?? '') as string,
      })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.slice(lastIndex) })
    }

    return parts
  }

  return (
    <div className="border-border bg-card relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b p-6">
        <div className="flex items-center gap-2">
          <div className="bg-semantic-success h-2 w-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-foreground font-medium">AI Tutor Online</span>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          {onOpenSessions && (
            <button
              onClick={onOpenSessions}
              className="border-border hover:bg-muted text-muted-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors"
              aria-label="Open chat history"
            >
              <History className="h-3.5 w-3.5" />
              History
            </button>
          )}
          {onNewChat && (
            <button
              onClick={onNewChat}
              className="border-border hover:bg-muted text-muted-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New Chat
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatBoxRef} className="flex-1 space-y-8 overflow-y-auto p-6">
        {error && (
          <div className="bg-semantic-error/10 text-semantic-error rounded-xl p-3 text-center text-sm">
            {error}
          </div>
        )}

        {isLoadingHistory && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center opacity-50">
            <p className="text-muted-foreground text-sm">Loading conversation...</p>
          </div>
        )}

        {messages.length === 0 && !isLoading && !isLoadingHistory && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center opacity-50">
            <Bot className="text-primary h-10 w-10" />
            <p className="text-muted-foreground text-sm">
              Ask me anything — I&apos;m here to help you learn.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const parts = parseContent(msg.content)
          return (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="bg-primary shadow-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-4 ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'border-border bg-muted text-foreground rounded-tl-none border'
                  }`}
                >
                  <div className="space-y-3 leading-relaxed whitespace-pre-wrap">
                    {parts.map((part, i) =>
                      part.type === 'text' ? (
                        <div key={i}>
                          {part.content.split('\n\n').map((block, j) => (
                            <p key={j} className="mb-2 last:mb-0">
                              {block}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <div
                          key={i}
                          className="border-border overflow-hidden rounded-xl border bg-[#1E1D2E] shadow-md"
                        >
                          <div className="border-border flex items-center justify-between border-b bg-[#0F0E17] px-4 py-2">
                            <span className="text-muted-foreground font-mono text-xs">
                              {part.language}
                            </span>
                            <div className="flex gap-1.5">
                              <div className="bg-semantic-error/40 h-2.5 w-2.5 rounded-full"></div>
                              <div className="bg-semantic-warning/40 h-2.5 w-2.5 rounded-full"></div>
                              <div className="bg-semantic-success/40 h-2.5 w-2.5 rounded-full"></div>
                            </div>
                          </div>
                          <div className="overflow-x-auto p-4">
                            <pre className="text-foreground/80 font-mono text-sm">
                              <code>{part.content}</code>
                            </pre>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="border-semantic-success bg-semantic-success/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 p-0.5">
                  <Image
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Richard"
                    alt="User"
                    width={32}
                    height={32}
                    className="h-full w-full rounded-full"
                    unoptimized
                  />
                </div>
              )}
            </div>
          )
        })}

        {isLoading && (
          <div className="flex gap-4">
            <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="border-border bg-muted rounded-2xl rounded-tl-none border p-4">
              <div className="flex h-5 items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="bg-primary h-2 w-2 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 pt-0">
        <div className="border-border bg-muted flex items-center gap-3 rounded-2xl border p-2 pr-2 shadow-sm transition-shadow hover:shadow-md">
          <button className="text-muted-foreground hover:bg-card hover:text-foreground rounded-lg p-2 transition-colors">
            <Plus className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="text-foreground placeholder-muted-foreground flex-1 bg-transparent text-sm focus:outline-none"
            disabled={isLoading}
          />
          <div className="flex items-center gap-2">
            <button className="text-muted-foreground hover:bg-card hover:text-foreground rounded-lg p-2 transition-colors">
              <ImageIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 rounded-xl p-2 shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-muted-foreground mt-3 text-center text-xs">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}
