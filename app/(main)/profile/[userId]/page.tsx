'use client'

import { useState, useEffect, use } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  GraduationCap,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Clock,
  Loader2,
  MessageSquare,
  BookOpen,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type ProfileData = {
  id: string
  name: string | null
  role: string
  displayName: string | null
  bio: string | null
  university: string | null
  major: string | null
  avatarUrl: string | null
}

type ConnectionStatus = 'connected' | 'pending_sent' | 'pending_received' | 'not_connected'

type StudyGroup = {
  id: string
  name: string
  subject: string
}

type ForumPost = {
  id: string
  title: string
  createdAt: string
}

export default function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const { data: session } = authClient.useSession()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('not_connected')
  const [connectionId, setConnectionId] = useState<string | null>(null)
  const [connectionCount, setConnectionCount] = useState(0)
  const [forumPostCount, setForumPostCount] = useState(0)
  const [studyGroupCount, setStudyGroupCount] = useState(0)
  const [recentGroups, setRecentGroups] = useState<StudyGroup[]>([])
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const currentUserId = session?.user?.id

  useEffect(() => {
    if (currentUserId && currentUserId === userId) {
      window.location.replace('/profile')
    }
  }, [currentUserId, userId])

  useEffect(() => {
    if (!userId) return

    async function load() {
      setLoading(true)
      try {
        const [profileRes, statusRes, countRes, statsRes, groupsRes, postsRes] = await Promise.all([
          fetch(`/api/user/profile?userId=${userId}`),
          fetch(`/api/connections/status?userId=${userId}`),
          fetch(`/api/connections/count?userId=${userId}`),
          fetch(`/api/user/stats?userId=${userId}`),
          fetch(`/api/study-groups?myGroups=true&userId=${userId}&limit=3`),
          fetch(`/api/forums/posts?userId=${userId}&limit=5`),
        ])

        const profileData = await profileRes.json()
        if (profileData.profile) setProfile(profileData.profile as ProfileData)

        if (statusRes.ok) {
          const statusData = await statusRes.json()
          setConnectionStatus(statusData.status as ConnectionStatus)
          setConnectionId(statusData.connectionId as string | null)
        }

        if (countRes.ok) {
          const countData = await countRes.json()
          setConnectionCount(countData.count as number)
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          if (typeof statsData.forumPostCount === 'number')
            setForumPostCount(statsData.forumPostCount)
          if (typeof statsData.studyGroupCount === 'number')
            setStudyGroupCount(statsData.studyGroupCount)
        }

        if (groupsRes.ok) {
          const groupsData = await groupsRes.json()
          if (Array.isArray(groupsData.groups))
            setRecentGroups(groupsData.groups.slice(0, 3) as StudyGroup[])
        }

        if (postsRes.ok) {
          const postsData = await postsRes.json()
          if (Array.isArray(postsData.posts))
            setRecentPosts(postsData.posts.slice(0, 5) as ForumPost[])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [userId])

  async function handleConnect() {
    setActionLoading(true)
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId }),
      })
      const data = await res.json()
      if (res.ok) {
        const newStatus = data.connection.status === 'ACCEPTED' ? 'connected' : 'pending_sent'
        setConnectionStatus(newStatus)
        setConnectionId(data.connection.id as string)
        if (newStatus === 'connected') setConnectionCount((c) => c + 1)
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(false)
    }
  }

  async function handleAccept() {
    if (!connectionId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED' }),
      })
      if (res.ok) {
        setConnectionStatus('connected')
        setConnectionCount((c) => c + 1)
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject() {
    if (!connectionId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      })
      if (res.ok) {
        setConnectionStatus('not_connected')
        setConnectionId(null)
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDisconnect() {
    if (!connectionId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/connections/${connectionId}`, { method: 'DELETE' })
      if (res.ok) {
        setConnectionStatus('not_connected')
        setConnectionId(null)
        setConnectionCount((c) => Math.max(0, c - 1))
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    )
  }

  const displayName = profile.displayName ?? profile.name ?? 'Unknown'
  const avatarSeed = encodeURIComponent(displayName)

  return (
    <div className="bg-background text-foreground px-6 py-6 transition-colors duration-300 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Hero Card — matches /profile layout */}
        <div className="border-border bg-card relative overflow-hidden rounded-3xl border shadow-sm">
          {/* Cover strip */}
          <div className="from-primary/30 to-primary/5 h-24 bg-gradient-to-r" />

          <div className="px-6 pb-6 md:px-8">
            {/* Avatar overlapping cover */}
            <div className="bg-primary -mt-12 mb-4 inline-block rounded-full p-1">
              <div className="bg-card rounded-full p-1">
                <Image
                  src={
                    profile.avatarUrl ??
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
                  }
                  alt={displayName}
                  width={80}
                  height={80}
                  className="bg-muted h-20 w-20 rounded-full object-cover"
                  unoptimized
                />
              </div>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-foreground text-2xl font-bold">{displayName}</h1>
                  {profile.role !== 'STUDENT' && (
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${
                        profile.role === 'ADMIN'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      }`}
                    >
                      {profile.role}
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                  {profile.major && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      {profile.major}
                    </div>
                  )}
                  {profile.university && (
                    <>
                      <span className="bg-muted-foreground h-1 w-1 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {profile.university}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              {currentUserId && (
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/chat/${userId}`}
                    className="border-border text-foreground hover:bg-accent rounded-full border px-5 py-2 text-sm font-medium transition-colors"
                  >
                    <MessageSquare className="mr-2 inline h-4 w-4" />
                    Message
                  </Link>

                  {connectionStatus === 'not_connected' && (
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
                      onClick={handleConnect}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      Connect
                    </Button>
                  )}

                  {connectionStatus === 'pending_sent' && (
                    <Button
                      variant="outline"
                      className="border-border rounded-full px-5"
                      onClick={handleDisconnect}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Clock className="mr-2 h-4 w-4" />
                      )}
                      Pending
                    </Button>
                  )}

                  {connectionStatus === 'pending_received' && (
                    <>
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
                        onClick={handleAccept}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <UserCheck className="mr-2 h-4 w-4" />
                        )}
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="border-border rounded-full px-5"
                        onClick={handleReject}
                        disabled={actionLoading}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}

                  {connectionStatus === 'connected' && (
                    <Button
                      variant="outline"
                      className="border-border rounded-full px-5"
                      onClick={handleDisconnect}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserCheck className="mr-2 h-4 w-4" />
                      )}
                      Connected
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Connections', value: connectionCount },
            { icon: MessageSquare, label: 'Forum Posts', value: forumPostCount },
            { icon: BookOpen, label: 'Study Groups', value: studyGroupCount },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="border-border bg-card rounded-2xl border p-4 text-center shadow-sm"
            >
              <Icon className="text-primary mx-auto mb-1 h-5 w-5" />
              <p className="text-foreground text-xl font-bold">{value}</p>
              <p className="text-muted-foreground text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
          <h2 className="text-foreground mb-2 font-semibold">About</h2>
          {profile.bio ? (
            <p className="text-muted-foreground text-sm leading-relaxed">{profile.bio}</p>
          ) : (
            <p className="text-muted-foreground text-sm italic">No bio shared yet.</p>
          )}
        </div>

        {/* Study Groups + Recent Posts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Study Groups */}
          <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-foreground font-semibold">
                Study Groups{studyGroupCount > 0 ? ` (${studyGroupCount})` : ''}
              </h2>
              <Link href="/groups" className="text-primary text-xs hover:underline">
                Browse all
              </Link>
            </div>
            {recentGroups.length > 0 ? (
              <ul className="space-y-2">
                {recentGroups.map((g) => (
                  <li key={g.id} className="flex items-center gap-2">
                    <BookOpen className="text-muted-foreground h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-foreground text-sm font-medium">{g.name}</p>
                      <p className="text-muted-foreground text-xs">{g.subject}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm italic">No groups joined yet.</p>
            )}
          </div>

          {/* Recent Forum Posts */}
          <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-foreground font-semibold">
                Recent Posts{forumPostCount > 0 ? ` (${forumPostCount})` : ''}
              </h2>
              <Link href="/forums" className="text-primary text-xs hover:underline">
                Browse all
              </Link>
            </div>
            {recentPosts.length > 0 ? (
              <ul className="space-y-2">
                {recentPosts.map((p) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <MessageSquare className="text-muted-foreground h-4 w-4 shrink-0" />
                    <p className="text-foreground line-clamp-1 text-sm">{p.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm italic">No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
