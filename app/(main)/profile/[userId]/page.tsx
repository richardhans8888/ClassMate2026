'use client'

import { useState, useEffect, use } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  MapPin,
  GraduationCap,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Clock,
  Loader2,
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

export default function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const { data: session } = authClient.useSession()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('not_connected')
  const [connectionId, setConnectionId] = useState<string | null>(null)
  const [connectionCount, setConnectionCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const currentUserId = session?.user?.id

  // Redirect to own profile if viewing self
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
        const [profileRes, statusRes, countRes] = await Promise.all([
          fetch(`/api/user/profile?userId=${userId}`),
          fetch(`/api/connections/status?userId=${userId}`),
          fetch(`/api/connections/count?userId=${userId}`),
        ])

        const profileData = await profileRes.json()
        if (profileData.profile) {
          setProfile(profileData.profile as ProfileData)
        }

        if (statusRes.ok) {
          const statusData = await statusRes.json()
          setConnectionStatus(statusData.status as ConnectionStatus)
          setConnectionId(statusData.connectionId as string | null)
        }

        if (countRes.ok) {
          const countData = await countRes.json()
          setConnectionCount(countData.count as number)
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
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    )
  }

  const displayName = profile.displayName ?? profile.name ?? 'Unknown'
  const avatarSeed = encodeURIComponent(displayName)

  return (
    <div className="bg-background text-foreground min-h-screen px-6 py-4 transition-colors duration-300 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Profile Header Card */}
        <div className="border-border bg-card relative overflow-hidden rounded-3xl border p-6 shadow-sm md:p-8">
          <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20">
            <GraduationCap className="text-muted-foreground h-32 w-32" />
          </div>

          <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="bg-primary h-32 w-32 rounded-full p-1">
                <div className="bg-card h-full w-full rounded-full p-1">
                  <Image
                    src={
                      profile.avatarUrl ??
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
                    }
                    alt={displayName}
                    width={128}
                    height={128}
                    className="bg-muted h-full w-full rounded-full"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <h1 className="text-foreground text-3xl font-bold">{displayName}</h1>
                  {profile.role !== 'STUDENT' && (
                    <span className="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-xs font-medium capitalize">
                      {profile.role.toLowerCase()}
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                  {profile.major && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      {profile.major}
                    </div>
                  )}
                  {profile.university && (
                    <>
                      <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {profile.university}
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>
                      {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {profile.bio && <p className="text-muted-foreground text-sm">{profile.bio}</p>}

              {/* Connection Actions */}
              {currentUserId && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {connectionStatus === 'not_connected' && (
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
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
                      className="border-border rounded-full px-6"
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
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
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
                        className="border-border rounded-full px-6"
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
                      className="border-border rounded-full px-6"
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

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="border-border bg-card rounded-2xl border border-dashed p-8 text-center shadow-sm">
              <p className="text-muted-foreground text-sm">No public content yet.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-muted-foreground mb-4 text-xs font-bold tracking-wider uppercase">
                About
              </h2>
              <div className="border-border bg-card space-y-3 rounded-3xl border p-5 shadow-sm">
                {profile.major && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-foreground">{profile.major}</span>
                  </div>
                )}
                {profile.university && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-foreground">{profile.university}</span>
                  </div>
                )}
                {!profile.major && !profile.university && (
                  <p className="text-muted-foreground text-sm">No details shared.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
