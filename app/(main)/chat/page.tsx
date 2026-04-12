'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Send, Search, Edit } from 'lucide-react'

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
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-foreground text-xl font-bold">Messages</h2>
            <Link
              href="/chat/new"
              className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
              aria-label="New message"
            >
              <Edit className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-muted text-foreground focus:bg-card focus:ring-ring w-full rounded-full border border-transparent py-2 pr-4 pl-9 text-sm transition-colors focus:ring-2 focus:outline-none"
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
            const avatarColor = getAvatarColor(displayName)

            return (
              <Link href={`/chat/${conversation.userId}`} key={conversation.userId}>
                <div
                  className={`border-border active:bg-accent/70 border-b p-4 transition-colors ${
                    conversation.unreadCount > 0 ? 'bg-accent/50' : 'bg-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div
                        className={`${avatarColor} flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white`}
                      >
                        {initial}
                      </div>
                      <div className="bg-semantic-success border-card absolute right-0 bottom-0 h-3 w-3 rounded-full border-2" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-baseline justify-between">
                        <h3 className="text-foreground truncate text-[15px] font-semibold">
                          {displayName}
                        </h3>
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
                      <div className="bg-primary text-primary-foreground flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-xs font-bold">
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
