'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  GraduationCap,
  MapPin,
  Search,
  Users,
  Loader2,
  UserPlus,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ConnectButton,
  type ConnectionStatus,
} from '@/components/features/connections/ConnectButton'

type DiscoverFilter = 'discover' | 'connected' | 'pending'

const FILTER_TABS: { value: DiscoverFilter; label: string }[] = [
  { value: 'discover', label: 'Discover' },
  { value: 'connected', label: 'Connected' },
  { value: 'pending', label: 'Pending' },
]

interface DiscoverUser {
  id: string
  name: string | null
  image: string | null
  role: string
  profile: {
    displayName: string | null
    avatarUrl: string | null
    bio: string | null
    university: string | null
    major: string | null
  } | null
  connectionStatus: ConnectionStatus
  connectionId: string | null
}

interface Meta {
  total: number
  page: number
  pages: number
}

export default function DiscoverPage() {
  const [users, setUsers] = useState<DiscoverUser[]>([])
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, pages: 1 })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<DiscoverFilter>('discover')
  const [loading, setLoading] = useState(true)

  const load = useCallback(
    async (currentPage: number, currentSearch: string, currentFilter: DiscoverFilter) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          filter: currentFilter,
          ...(currentSearch ? { search: currentSearch } : {}),
        })
        const res = await fetch(`/api/users/discover?${params}`)
        const data = await res.json()
        if (res.ok) {
          setUsers(data.users as DiscoverUser[])
          setMeta(data.meta as Meta)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    void load(page, search, filter)
  }, [page, load, search, filter])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    void load(1, search, filter)
  }

  function handleFilterChange(newFilter: DiscoverFilter) {
    setFilter(newFilter)
    setPage(1)
  }

  function handleStatusChange(
    userId: string,
    status: ConnectionStatus,
    connectionId: string | null
  ) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, connectionStatus: status, connectionId } : u))
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen px-6 py-4 transition-colors duration-300 md:px-8 md:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-foreground mb-1 text-2xl font-bold">Discover People</h1>
          <p className="text-muted-foreground text-sm">
            Find and connect with other students on ClassMate.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, university, or major…"
              className="border-border bg-card text-foreground h-10 w-full rounded-lg border py-2 pr-4 pl-9 text-sm"
            />
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground rounded-lg px-4">
            Search
          </Button>
        </form>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground border'
              }`}
            >
              {tab.label}
              {!loading && filter === tab.value && meta.total > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                    filter === tab.value
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {meta.total}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-muted-foreground text-sm">
            {filter === 'discover' &&
              `${meta.total} new ${meta.total === 1 ? 'person' : 'people'} to connect with`}
            {filter === 'connected' &&
              `${meta.total} ${meta.total === 1 ? 'connection' : 'connections'}`}
            {filter === 'pending' &&
              `${meta.total} pending ${meta.total === 1 ? 'request' : 'requests'}`}
          </p>
        )}

        {/* User grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="border-border rounded-2xl border border-dashed p-12 text-center">
            <Users className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
            <p className="text-muted-foreground text-sm">No users found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => {
              const displayName = user.profile?.displayName ?? user.name ?? 'Unknown'
              const avatarSeed = encodeURIComponent(displayName)
              // Prefer manually set profile avatar, then Google OAuth photo, then generated fallback
              const avatarSrc =
                user.profile?.avatarUrl ??
                user.image ??
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
              const isPendingReceived = user.connectionStatus === 'pending_received'
              const isConnected = user.connectionStatus === 'connected'

              return (
                <div
                  key={user.id}
                  className={`bg-card flex flex-col gap-3 rounded-2xl border p-5 shadow-sm transition-shadow duration-200 hover:shadow-md ${
                    isPendingReceived
                      ? 'border-primary/40 ring-primary/10 ring-1'
                      : isConnected
                        ? 'border-emerald-500/30 dark:border-emerald-500/20'
                        : 'border-border'
                  }`}
                >
                  {/* Status banners */}
                  {isPendingReceived && (
                    <div className="bg-primary/10 text-primary flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium">
                      <UserPlus className="h-3.5 w-3.5 shrink-0" />
                      <span>Wants to connect with you</span>
                    </div>
                  )}
                  {isConnected && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <UserCheck className="h-3.5 w-3.5 shrink-0" />
                      <span>Connected</span>
                    </div>
                  )}

                  {/* Avatar + identity */}
                  <div className="flex items-start gap-3">
                    <Link href={`/profile/${user.id}`} className="shrink-0">
                      <Image
                        src={avatarSrc}
                        alt={displayName}
                        width={56}
                        height={56}
                        className="bg-muted h-14 w-14 rounded-full object-cover"
                        unoptimized
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${user.id}`}
                          className="text-foreground hover:text-primary truncate text-sm font-semibold"
                        >
                          {displayName}
                        </Link>
                        {user.role !== 'STUDENT' && (
                          <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2 py-0.5 text-xs capitalize">
                            {user.role.toLowerCase()}
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
                        {user.profile?.major && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {user.profile.major}
                          </span>
                        )}
                        {user.profile?.university && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.profile.university}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio — always shown when present */}
                  {user.profile?.bio && (
                    <p className="text-muted-foreground line-clamp-2 text-xs">{user.profile.bio}</p>
                  )}

                  {/* Action area — varies by connection state */}
                  {isPendingReceived ? (
                    <div className="mt-auto flex flex-col gap-2 pt-1">
                      <ConnectButton
                        targetUserId={user.id}
                        initialStatus={user.connectionStatus}
                        initialConnectionId={user.connectionId}
                        onStatusChange={(status, connectionId) =>
                          handleStatusChange(user.id, status, connectionId)
                        }
                        fullWidth
                      />
                      <Link
                        href={`/profile/${user.id}`}
                        className="text-muted-foreground hover:text-primary text-center text-xs"
                      >
                        View profile →
                      </Link>
                    </div>
                  ) : isConnected ? (
                    /* Connected: prominent Message CTA + subtle disconnect */
                    <div className="mt-auto flex flex-col gap-2 pt-1">
                      <Link
                        href={`/chat/${user.id}`}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors"
                      >
                        Send a message
                      </Link>
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/profile/${user.id}`}
                          className="text-muted-foreground hover:text-primary text-xs"
                        >
                          View profile →
                        </Link>
                        <ConnectButton
                          targetUserId={user.id}
                          initialStatus={user.connectionStatus}
                          initialConnectionId={user.connectionId}
                          onStatusChange={(status, connectionId) =>
                            handleStatusChange(user.id, status, connectionId)
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    /* Default: Message link + Connect button */
                    <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                      <Link
                        href={`/profile/${user.id}`}
                        className="text-muted-foreground hover:text-primary text-xs"
                      >
                        View profile →
                      </Link>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/chat/${user.id}`}
                          className="border-border text-foreground hover:bg-accent rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                        >
                          Message
                        </Link>
                        <ConnectButton
                          targetUserId={user.id}
                          initialStatus={user.connectionStatus}
                          initialConnectionId={user.connectionId}
                          onStatusChange={(status, connectionId) =>
                            handleStatusChange(user.id, status, connectionId)
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && meta.pages >= 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-border rounded-lg"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-muted-foreground text-sm">
              Page {meta.page} of {Math.max(1, meta.pages)}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-border rounded-lg"
              disabled={page >= meta.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
