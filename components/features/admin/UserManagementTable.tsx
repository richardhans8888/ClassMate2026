'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type UserRole = 'STUDENT' | 'MODERATOR' | 'ADMIN'

interface AdminUser {
  id: string
  email: string
  name: string | null
  role: UserRole
  createdAt: string
  profile: { displayName: string | null; avatarUrl: string | null } | null
}

const ROLE_COLORS: Record<UserRole, string> = {
  STUDENT: 'bg-muted text-muted-foreground',
  MODERATOR: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  ADMIN: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export function UserManagementTable() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [draftSearch, setDraftSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const limit = 20

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/users?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = (await res.json()) as { users: AdminUser[]; total: number }
      setUsers(data.users)
      setTotal(data.total)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    setSearch(draftSearch)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="border-border bg-background relative flex-1 rounded-lg border">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="text-foreground placeholder:text-muted-foreground w-full bg-transparent py-2 pr-4 pl-9 text-sm outline-none"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
      </form>

      {/* Table */}
      <div className="border-border overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-border bg-muted border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="text-muted-foreground px-4 py-8 text-center" colSpan={4}>
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td className="text-muted-foreground px-4 py-8 text-center" colSpan={4}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const displayName =
                  user.profile?.displayName ?? user.name ?? user.email.split('@')[0] ?? '?'
                return (
                  <tr key={user.id} className="border-border border-b last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-foreground font-medium">{displayName}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-xs">{user.email}</td>
                    <td className="text-muted-foreground px-4 py-3 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            {total} user{total !== 1 ? 's' : ''} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
