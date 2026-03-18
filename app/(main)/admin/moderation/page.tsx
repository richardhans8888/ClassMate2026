import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { requireAdmin } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'

export default async function AdminModerationPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const isAdmin = await requireAdmin(session)
  if (!isAdmin) {
    redirect('/dashboard')
  }

  const flags = await prisma.flaggedContent.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Moderation Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Pending flagged content requiring admin review.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Content ID</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Reporter</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {flags.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-500 dark:text-gray-400" colSpan={5}>
                  No pending flags.
                </td>
              </tr>
            ) : (
              flags.map((flag) => (
                <tr className="border-b last:border-b-0" key={flag.id}>
                  <td className="px-4 py-3 uppercase">{flag.contentType}</td>
                  <td className="px-4 py-3 font-mono text-xs">{flag.contentId}</td>
                  <td className="px-4 py-3">{flag.reason}</td>
                  <td className="px-4 py-3 font-mono text-xs">{flag.reporterId}</td>
                  <td className="px-4 py-3">{new Date(flag.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
