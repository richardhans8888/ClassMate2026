'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, MapPin, Search, Users, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ConnectButton,
  type ConnectionStatus,
} from '@/components/features/connections/ConnectButton'

interface DiscoverUser {
  id: string
  name: string | null
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
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (currentPage: number, currentSearch: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
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
  }, [])

  useEffect(() => {
    void load(page, search)
  }, [page, load, search])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    void load(1, search)
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

        {/* Results count */}
        {!loading && (
          <p className="text-muted-foreground text-sm">
            {meta.total} {meta.total === 1 ? 'person' : 'people'} found
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

              return (
                <div
                  key={user.id}
                  className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <Link href={`/profile/${user.id}`} className="shrink-0">
                      <Image
                        src={
                          user.profile?.avatarUrl ??
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
                        }
                        alt={displayName}
                        width={48}
                        height={48}
                        className="bg-muted rounded-full"
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

                  {user.profile?.bio && (
                    <p className="text-muted-foreground line-clamp-2 text-xs">{user.profile.bio}</p>
                  )}

                  <div className="flex items-center justify-between gap-2">
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
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-border rounded-lg"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">
              Page {meta.page} of {meta.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-border rounded-lg"
              disabled={page === meta.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
