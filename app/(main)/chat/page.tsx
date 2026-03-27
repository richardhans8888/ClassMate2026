'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Send, Search } from 'lucide-react'

const POLL_INTERVAL_MS = 5000

type Conversation = {
  userId: string
  participant: {
    id: string
    email: string
    displayName: string | null
    avatarUrl: string | null
  }
  lastMessage: {
    id: string
    content: string
    createdAt: string
    senderId: string
  }
  unreadCount: number
}

function formatTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (sameDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function ChatPage() {
  const [query, setQuery] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadConversations(silent = false) {
    if (!silent) setLoading(true)
    try {
      const res = await fetch('/api/messages/conversations', { cache: 'no-store' })
      const data = (await res.json()) as { conversations?: Conversation[]; error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Unable to load conversations.')
        return
      }

      setConversations(data.conversations ?? [])
      setError(null)
    } catch {
      setError('Unable to load conversations.')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    void loadConversations()

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadConversations(true)
      }
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  const filteredConversations = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return conversations

    return conversations.filter((conversation) => {
      const name = conversation.participant.displayName ?? conversation.participant.email
      return (
        name.toLowerCase().includes(term) ||
        conversation.lastMessage.content.toLowerCase().includes(term)
      )
    })
  }, [conversations, query])

  return (
    <div className="h-full flex-1">
      <div className="bg-card h-full overflow-y-auto md:hidden">
        <div className="border-border bg-card sticky top-0 z-10 border-b p-4">
          <h2 className="text-foreground mb-3 text-xl font-bold">Messages</h2>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-muted text-foreground focus:bg-card focus:ring-ring w-full rounded-lg border border-transparent py-2 pr-4 pl-9 text-sm transition-colors focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        {loading && <p className="text-muted-foreground p-4 text-sm">Loading conversations...</p>}
        {!loading && error && <p className="text-semantic-error p-4 text-sm">{error}</p>}
        {!loading && !error && filteredConversations.length === 0 && (
          <p className="text-muted-foreground p-4 text-sm">No conversations yet.</p>
        )}

        {!loading &&
          !error &&
          filteredConversations.map((conversation) => {
            const displayName =
              conversation.participant.displayName ?? conversation.participant.email
            const initial = displayName.charAt(0).toUpperCase() || 'U'

            return (
              <Link href={`/chat/${conversation.userId}`} key={conversation.userId}>
                <div
                  className={`border-border border-b p-4 ${
                    conversation.unreadCount > 0 ? 'bg-accent/50' : 'bg-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-baseline justify-between">
                        <h3 className="text-foreground truncate font-semibold">{displayName}</h3>
                        <span className="text-muted-foreground text-xs whitespace-nowrap">
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p
                        className={`truncate text-sm ${
                          conversation.unreadCount > 0
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
      </div>

      <div className="bg-muted hidden h-full flex-col items-center justify-center p-8 text-center md:flex">
        <div className="bg-accent mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <Send className="text-primary ml-1 h-10 w-10" />
        </div>
        <h2 className="text-foreground mb-2 text-2xl font-bold">Select a conversation</h2>
        <p className="text-muted-foreground max-w-md">
          Choose a contact from the list to start chatting.
        </p>
      </div>
    </div>
  )
}
