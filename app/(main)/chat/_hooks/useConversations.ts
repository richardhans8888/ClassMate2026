'use client'

import { useCallback, useEffect, useState } from 'react'

export type Conversation = {
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

export type StudyGroup = {
  id: string
  name: string
  subject: string
  memberCount: number
}

const POLL_INTERVAL_MS = 5000

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const [convRes, groupRes] = await Promise.all([
        fetch('/api/messages/conversations', { cache: 'no-store' }),
        fetch('/api/study-groups?myGroups=true&limit=50', { cache: 'no-store' }),
      ])

      const convData = (await convRes.json()) as { conversations?: Conversation[]; error?: string }
      const groupData = (await groupRes.json()) as { groups?: StudyGroup[]; error?: string }

      if (!convRes.ok) {
        setError(convData.error ?? 'Unable to load conversations.')
        return
      }

      setConversations(convData.conversations ?? [])
      setStudyGroups(groupData.groups ?? [])
      setError(null)
    } catch {
      setError('Unable to load conversations.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void load(true)
      }
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [load])

  return { conversations, studyGroups, loading, error, refresh: load }
}
