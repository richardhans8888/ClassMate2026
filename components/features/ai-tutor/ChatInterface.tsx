'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Send, Image as ImageIcon, Plus, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Message } from '../../../hooks/useChat'

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => void
}

export function ChatInterface({ messages, isLoading, error, sendMessage }: ChatInterfaceProps) {
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
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-[#0F1117]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="font-medium text-gray-900 dark:text-gray-200">AI Tutor Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatBoxRef} className="flex-1 space-y-8 overflow-y-auto p-6">
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-500 dark:bg-red-900/20">
            {error}
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center opacity-50">
            <Bot className="h-10 w-10 text-indigo-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask me anything — I&apos;m here to help you learn.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const parts = parseContent(msg.content)
          return (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-4 ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user'
                      ? 'rounded-tr-none bg-blue-600 text-white dark:bg-[#2A2D3A] dark:text-gray-100'
                      : 'rounded-tl-none border border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-[#1E2028] dark:text-gray-300'
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
                          className="overflow-hidden rounded-xl border border-gray-700 bg-[#1e293b] shadow-md dark:bg-[#0D0F14]"
                        >
                          <div className="flex items-center justify-between border-b border-gray-700 bg-[#0f172a] px-4 py-2 dark:bg-[#1A1C24]">
                            <span className="font-mono text-xs text-gray-400">{part.language}</span>
                            <div className="flex gap-1.5">
                              <div className="h-2.5 w-2.5 rounded-full bg-red-500/40"></div>
                              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40"></div>
                              <div className="h-2.5 w-2.5 rounded-full bg-green-500/40"></div>
                            </div>
                          </div>
                          <div className="overflow-x-auto p-4">
                            <pre className="font-mono text-sm text-gray-300">
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-100 p-0.5">
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-none border border-gray-200 bg-gray-100 p-4 dark:border-gray-800 dark:bg-[#1E2028]">
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
                    className="h-2 w-2 rounded-full bg-indigo-400"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 pt-0">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-2 pr-2 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#1E2028]">
          <button className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
            <Plus className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-200"
            disabled={isLoading}
          />
          <div className="flex items-center gap-2">
            <button className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
              <ImageIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="rounded-xl bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-600">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}
