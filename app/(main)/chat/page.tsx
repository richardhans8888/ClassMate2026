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
      <div className="h-full overflow-y-auto bg-white md:hidden">
        <div className="sticky top-0 z-10 border-b bg-white p-4">
          <h2 className="mb-3 text-xl font-bold text-gray-900">Messages</h2>
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-transparent bg-gray-50 py-2 pr-4 pl-9 text-sm transition-colors focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {loading && <p className="p-4 text-sm text-gray-500">Loading conversations...</p>}
        {!loading && error && <p className="p-4 text-sm text-red-600">{error}</p>}
        {!loading && !error && filteredConversations.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No conversations yet.</p>
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
                  className={`border-b border-gray-50 p-4 ${
                    conversation.unreadCount > 0 ? 'bg-blue-50/50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-baseline justify-between">
                        <h3 className="truncate font-semibold text-gray-900">{displayName}</h3>
                        <span className="text-xs whitespace-nowrap text-gray-500">
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p
                        className={`truncate text-sm ${
                          conversation.unreadCount > 0
                            ? 'font-medium text-gray-900'
                            : 'text-gray-500'
                        }`}
                      >
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
      </div>

      <div className="hidden h-full flex-col items-center justify-center bg-gray-50 p-8 text-center md:flex">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <Send className="ml-1 h-10 w-10 text-blue-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Select a conversation</h2>
        <p className="max-w-md text-gray-500">Choose a contact from the list to start chatting.</p>
      </div>
    </div>
  )
}
