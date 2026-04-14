import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { requireAdmin } from '@/lib/authorize'
import { UserManagementTable } from '@/components/features/admin/UserManagementTable'

export default async function AdminUsersPage() {
  const session = await getSession()
  if (!session) notFound()

  const isAdmin = await requireAdmin(session)
  if (!isAdmin) notFound()

  return (
    <div className="container mx-auto px-6 py-8 md:px-8">
      <h1 className="text-foreground text-2xl font-bold">User Management</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Browse all registered users and their roles.
      </p>

      <div className="mt-6">
        <UserManagementTable />
      </div>
    </div>
  )
}
