'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, MapPin, Users, Loader2 } from 'lucide-react'
import { ConnectButton } from './ConnectButton'

interface ConnectionUser {
  id: string
  name: string | null
  profile: {
    displayName: string | null
    avatarUrl: string | null
    university: string | null
    major: string | null
  } | null
}

interface Connection {
  id: string
  senderId: string
  recipientId: string
  status: string
  sender?: ConnectionUser
  recipient?: ConnectionUser
}

interface ConnectionsListProps {
  currentUserId: string
}

export function ConnectionsList({ currentUserId }: ConnectionsListProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/connections?status=accepted')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.connections)) {
          setConnections(data.connections as Connection[])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleStatusChange(connectionId: string) {
    setConnections((prev) => prev.filter((c) => c.id !== connectionId))
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="text-primary h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (connections.length === 0) {
    return (
      <div className="border-border rounded-2xl border border-dashed p-8 text-center">
        <Users className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
        <p className="text-muted-foreground text-sm">No connections yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {connections.map((conn) => {
        const other = conn.senderId === currentUserId ? conn.recipient : conn.sender
        if (!other) return null
        const displayName = other.profile?.displayName ?? other.name ?? 'Unknown'
        const avatarSeed = encodeURIComponent(displayName)

        return (
          <div
            key={conn.id}
            className="border-border bg-card flex items-start gap-4 rounded-2xl border p-4 shadow-sm"
          >
            <Link href={`/profile/${other.id}`} className="shrink-0">
              <Image
                src={
                  other.profile?.avatarUrl ??
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
                }
                alt={displayName}
                width={48}
                height={48}
                className="bg-muted rounded-full"
                unoptimized
              />
            </Link>
            <div className="min-w-0 flex-1 space-y-1">
              <Link
                href={`/profile/${other.id}`}
                className="text-foreground hover:text-primary truncate text-sm font-semibold"
              >
                {displayName}
              </Link>
              <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                {other.profile?.major && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {other.profile.major}
                  </span>
                )}
                {other.profile?.university && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {other.profile.university}
                  </span>
                )}
              </div>
              <div className="pt-1">
                <ConnectButton
                  targetUserId={other.id}
                  initialStatus="connected"
                  initialConnectionId={conn.id}
                  onStatusChange={(_, newConnId) => {
                    if (!newConnId) handleStatusChange(conn.id)
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
