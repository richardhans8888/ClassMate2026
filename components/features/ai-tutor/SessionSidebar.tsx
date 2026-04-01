'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, MessageSquare } from 'lucide-react'

interface ChatSession {
  id: string
  title: string
  subject: string
  updatedAt: string
  _count: { messages: number }
}

interface SessionSidebarProps {
  activeSessionId: string | undefined
  onSelectSession: (sessionId: string) => void
  onNewChat: () => void
  onDeleteSession: (sessionId: string) => void
}

function formatSessionTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function SessionSidebar({
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: SessionSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/sessions')
      if (!res.ok) return
      const data = (await res.json()) as { sessions: ChatSession[] }
      setSessions(data.sessions)
    } catch {
      // Silently fail — user can still chat
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSessions()
  }, [fetchSessions, activeSessionId])

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    try {
      const res = await fetch(`/api/sessions?sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId))
        onDeleteSession(sessionId)
      }
    } catch {
      // Silently fail
    }
  }

  return (
    <div className="border-border flex h-full w-64 shrink-0 flex-col border-r">
      <div className="border-border border-b p-4">
        <button
          onClick={onNewChat}
          className="border-border hover:bg-muted text-foreground flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading && <p className="text-muted-foreground p-2 text-xs">Loading sessions...</p>}

        {!loading && sessions.length === 0 && (
          <p className="text-muted-foreground p-2 text-xs">No past sessions yet.</p>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectSession(session.id)}
            className={`group hover:bg-muted mb-1 flex cursor-pointer items-start justify-between gap-2 rounded-lg p-2 transition-colors ${
              session.id === activeSessionId ? 'bg-accent' : ''
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                <p className="text-foreground truncate text-sm font-medium">{session.title}</p>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {formatSessionTime(session.updatedAt)} &middot; {session._count.messages} msg
                {session._count.messages !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={(e) => void handleDelete(e, session.id)}
              className="text-muted-foreground hover:text-destructive hidden shrink-0 rounded p-0.5 transition-colors group-hover:block"
              aria-label="Delete session"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
