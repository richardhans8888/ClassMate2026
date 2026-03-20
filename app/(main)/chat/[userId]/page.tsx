'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, Video, MoreVertical, Send, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

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

export default function ChatConversationPage({ params }: { params: { userId: string } }) {
  const userId = params.userId
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
    void loadThread()
    void markRead()

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadThread(true)
      }
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [loadThread, markRead])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Chat Header */}
      <div className="z-10 flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
            {participantInitial}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{participantName}</h3>
            <span className="text-xs text-gray-500">Direct messages</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-lg text-gray-500">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg text-gray-500">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg text-gray-500">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
        {loading && (
          <div className="flex h-full items-center justify-center text-gray-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading messages...
          </div>
        )}

        {!loading && error && (
          <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No messages yet. Start the conversation.
          </div>
        )}

        {!loading &&
          messages.map((msg) => {
            const isMe = msg.senderId !== userId
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                    isMe
                      ? 'rounded-br-none bg-blue-600 text-white'
                      : 'rounded-bl-none border border-gray-100 bg-white text-gray-800'
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`mt-1 text-right text-[10px] ${
                      isMe ? 'text-blue-100' : 'text-gray-400'
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
      <div className="border-t bg-white p-4">
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
              className="w-full rounded-full border border-transparent bg-gray-50 py-3 pr-10 pl-4 text-sm transition-colors focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <Button
            size="icon"
            disabled={sending || input.trim().length === 0}
            onClick={() => void handleSendMessage()}
            className="h-10 w-10 shrink-0 rounded-full rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Send className="ml-0.5 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
