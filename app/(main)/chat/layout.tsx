'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
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
    <div className="container mx-auto h-[calc(100vh-64px)] px-4 py-6">
      <div className="flex h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Sidebar - Contacts */}
        <div className="flex hidden h-full w-full flex-col border-r border-gray-200 md:flex md:w-80 dark:border-gray-700">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-lg border border-transparent bg-gray-50 py-2 pr-4 pl-9 text-sm text-gray-900 transition-colors focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
                Loading conversations...
              </p>
            )}

            {!loading && error && <p className="p-4 text-sm text-red-600">{error}</p>}

            {!loading && !error && filteredConversations.length === 0 && (
              <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No conversations yet.</p>
            )}

            {!loading &&
              !error &&
              filteredConversations.map((conversation) => {
                const displayName =
                  conversation.participant.displayName ?? conversation.participant.email
                const initial = displayName.charAt(0).toUpperCase() || 'U'
                const href = `/chat/${conversation.userId}`
                const isActive = pathname === href

                return (
                  <Link href={href} key={conversation.userId}>
                    <div
                      className={`cursor-pointer border-b border-gray-50 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${
                        isActive
                          ? 'bg-blue-100/70 dark:bg-blue-900/30'
                          : conversation.unreadCount > 0
                            ? 'bg-blue-50/50 dark:bg-blue-900/20'
                            : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {initial}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-baseline justify-between">
                            <h3 className="truncate font-semibold text-gray-900 dark:text-white">
                              {displayName}
                            </h3>
                            <span className="text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                              {formatTime(conversation.lastMessage.createdAt)}
                            </span>
                          </div>
                          <p
                            className={`truncate text-sm ${conversation.unreadCount > 0 ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
                          >
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex h-full flex-1 flex-col">{children}</div>
      </div>
    </div>
  )
}
