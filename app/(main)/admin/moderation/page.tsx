import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { requireModerator } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'

export default async function AdminModerationPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const isModerator = await requireModerator(session)
  if (!isModerator) {
    redirect('/dashboard')
  }

  const flags = await prisma.flaggedContent.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="container mx-auto px-6 py-8 md:px-8">
      <h1 className="text-foreground text-2xl font-bold">Moderation Dashboard</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Pending flagged content requiring moderator review.
      </p>

      <div className="border-border bg-card mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-border bg-muted border-b">
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
                <td className="text-muted-foreground px-4 py-6" colSpan={5}>
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
