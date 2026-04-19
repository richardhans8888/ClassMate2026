'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Plus, GraduationCap, History, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { authClient } from '@/lib/auth-client'
import type { Message } from '../../../hooks/useChat'

const SUGGESTED_PROMPTS = [
  'Explain Big O notation with examples',
  'Help me understand integration by parts',
  'What is the difference between TCP and UDP?',
  'Explain the CAP theorem',
]

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
  isLoadingHistory?: boolean
  error: string | null
  sendMessage: (content: string) => void
  onNewChat?: () => void
  onOpenSessions?: () => void
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="border-border overflow-hidden rounded-xl border bg-zinc-900 shadow-md">
      <div className="border-border flex items-center justify-between border-b bg-zinc-950 px-4 py-2">
        <span className="text-muted-foreground font-mono text-xs">{language}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <div className="flex gap-1.5">
            <div className="bg-semantic-error/40 h-2.5 w-2.5 rounded-full" />
            <div className="bg-semantic-warning/40 h-2.5 w-2.5 rounded-full" />
            <div className="bg-semantic-success/40 h-2.5 w-2.5 rounded-full" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm text-zinc-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className ?? '')
    if (match) {
      return <CodeBlock language={match[1] ?? 'code'} code={String(children).replace(/\n$/, '')} />
    }
    return (
      <code className="rounded bg-zinc-900 px-1 py-0.5 font-mono text-sm text-zinc-100" {...props}>
        {children}
      </code>
    )
  },
  p({ children }: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className="mb-2 last:mb-0">{children}</p>
  },
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
  const { data: session } = authClient.useSession()
  const userName = session?.user?.name ?? 'User'
  const userInitial = userName.charAt(0).toUpperCase()

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

  return (
    <div className="bg-card flex h-full min-w-0 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border bg-card flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <div className="bg-semantic-success h-2 w-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <div>
            <span className="text-foreground font-medium">ClassMate AI</span>
            <span className="text-muted-foreground ml-2 text-xs">Your study companion</span>
          </div>
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
      <div ref={chatBoxRef} className="flex-1 space-y-6 overflow-x-hidden overflow-y-auto p-4">
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
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl">
              <GraduationCap className="text-primary h-8 w-8" />
            </div>
            <div>
              <p className="text-foreground text-base font-semibold">Your AI Study Companion</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Ask anything — I&apos;ll help you understand, not just answer.
              </p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="border-border bg-muted hover:bg-accent text-foreground rounded-full border px-4 py-2 text-xs transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex min-w-0 gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div className="bg-primary shadow-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            )}

            <div
              className={`max-w-[85%] min-w-0 space-y-4 ${msg.role === 'user' ? 'order-first' : ''}`}
            >
              <div
                className={`overflow-hidden rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'border-border bg-muted text-foreground rounded-tl-none border'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden leading-relaxed break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {msg.content}
                  </p>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="border-semantic-success bg-semantic-success/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold">
                {userInitial}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
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
      <div className="border-border border-t p-4">
        <div className="border-border bg-muted flex items-center gap-3 rounded-2xl border p-2 pr-2 shadow-sm transition-shadow hover:shadow-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="text-foreground placeholder-muted-foreground flex-1 bg-transparent pl-2 text-sm focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 rounded-xl p-2 shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-muted-foreground mt-3 text-center text-xs">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}
