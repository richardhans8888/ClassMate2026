'use client'

import { useCallback, useEffect, useMemo, useRef, useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, Video, MoreVertical, Send, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-fuchsia-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-indigo-500',
]

function getAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length] ?? 'bg-violet-500'
}

const POLL_INTERVAL_MS = 5000

type Message = {
  id: string
  senderId: string
  recipientId: string
  content: string
  isRead: boolean
  createdAt: string
}

type Participant = {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
}

function formatMessageTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatConversationPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const participantName = useMemo(() => {
    if (!participant) return 'Conversation'
    return participant.displayName ?? participant.email
  }, [participant])

  const participantInitial = participantName.charAt(0).toUpperCase() || 'U'

  const loadThread = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true)
      try {
        const res = await fetch(`/api/messages/conversations/${userId}?limit=50`, {
          cache: 'no-store',
        })
        const data = (await res.json()) as {
          participant?: Participant
          messages?: Message[]
          error?: string
        }

        if (!res.ok) {
          setError(data.error ?? 'Unable to load messages.')
          return
        }

        setParticipant(data.participant ?? null)
        setMessages(data.messages ?? [])
        setError(null)
      } catch {
        setError('Unable to load messages.')
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [userId]
  )

  const markRead = useCallback(async () => {
    try {
      await fetch(`/api/messages/conversations/${userId}/read`, { method: 'POST' })
    } catch {
      // Ignore read-state update failures to avoid blocking thread usage.
    }
  }, [userId])

  async function handleSendMessage() {
    const content = input.trim()
    if (!content || sending) return

    setSending(true)
    setError(null)
    try {
      const res = await fetch(`/api/messages/conversations/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = (await res.json()) as {
        message?: Message
        error?: string
      }

      if (!res.ok || !data.message) {
        setError(data.error ?? 'Unable to send message.')
        return
      }

      setMessages((prev) => [...prev, data.message as Message])
      setInput('')
    } catch {
      setError('Unable to send message.')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (!userId) return
    void loadThread()
    void markRead()

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadThread(true)
      }
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [loadThread, markRead, userId])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="bg-card flex h-full flex-col">
      {/* Chat Header */}
      <div className="border-border bg-card z-10 flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div
            className={`${getAvatarColor(participantName)} flex h-10 w-10 items-center justify-center rounded-full font-bold text-white`}
          >
            {participantInitial}
          </div>
          <div>
            <h3 className="text-foreground font-semibold">{participantName}</h3>
            <span className="text-muted-foreground text-xs">Direct messages</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground rounded-lg">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground rounded-lg">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground rounded-lg">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={messagesContainerRef} className="bg-muted flex-1 space-y-4 overflow-y-auto p-4">
        {loading && (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading messages...
          </div>
        )}

        {!loading && error && (
          <div className="border-semantic-error/30 bg-semantic-error/10 text-semantic-error mb-2 rounded-lg border px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            No messages yet. Start the conversation.
          </div>
        )}

        {!loading &&
          messages.map((msg) => {
            const isMe = msg.senderId !== userId
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'border-border bg-card text-foreground rounded-bl-none border'
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`mt-1 text-right text-[10px] ${
                      isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
      </div>

      {/* Chat Input */}
      <div className="border-border bg-card border-t p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void handleSendMessage()
                }
              }}
              className="bg-muted text-foreground focus:bg-card focus:ring-ring w-full rounded-full border border-transparent py-3 pr-10 pl-4 text-sm transition-colors focus:ring-2 focus:outline-none"
            />
          </div>
          <Button
            size="icon"
            disabled={sending || input.trim().length === 0}
            onClick={() => void handleSendMessage()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 shrink-0 rounded-full rounded-lg"
          >
            <Send className="ml-0.5 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
