import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { requireModerator, requireAdmin } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'

const ACTION_LABELS: Record<string, string> = {
  FLAG_CREATED: 'Flag Created',
  FLAG_RESOLVED: 'Flag Resolved',
  CONTENT_DELETED: 'Content Deleted',
}

const ACTION_COLORS: Record<string, string> = {
  FLAG_CREATED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  FLAG_RESOLVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  CONTENT_DELETED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export default async function AdminModerationPage() {
  const session = await getSession()
  if (!session) {
    notFound()
  }

  const isModerator = await requireModerator(session)
  if (!isModerator) {
    notFound()
  }

  const isAdmin = await requireAdmin(session)

  const [flags, logs] = await Promise.all([
    prisma.flaggedContent.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    isAdmin
      ? prisma.moderationLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 200,
          include: {
            actor: { select: { id: true, email: true, name: true } },
          },
        })
      : Promise.resolve([]),
  ])

  return (
    <div className="container mx-auto space-y-10 px-6 py-8 md:px-8">
      {/* Pending Flags */}
      <section>
        <h1 className="text-foreground text-2xl font-bold">Moderation Queue</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Pending flagged content requiring review.
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
      </section>

      {/* Moderation Logs — admin only */}
      {isAdmin && (
        <section>
          <h2 className="text-foreground text-xl font-bold">Moderation Logs</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Audit trail of all moderation actions. Showing the most recent 200 entries.
          </p>

          <div className="border-border bg-card mt-6 overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="border-border bg-muted border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Target</th>
                  <th className="px-4 py-3 font-semibold">Moderator</th>
                  <th className="px-4 py-3 font-semibold">Reason</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td className="text-muted-foreground px-4 py-8 text-center" colSpan={5}>
                      No moderation actions recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const actorName =
                      log.actor?.name ?? log.actor?.email?.split('@')[0] ?? log.actorId
                    const actionLabel = ACTION_LABELS[log.action] ?? log.action
                    const actionColor =
                      ACTION_COLORS[log.action] ?? 'bg-muted text-muted-foreground'

                    return (
                      <tr key={log.id} className="border-border border-b last:border-b-0">
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${actionColor}`}
                          >
                            {actionLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-foreground text-xs font-medium">
                            {log.targetType}
                          </span>
                          <p className="text-muted-foreground font-mono text-[10px]">
                            {log.targetId}
                          </p>
                        </td>
                        <td className="text-muted-foreground px-4 py-3 text-xs">{actorName}</td>
                        <td className="text-muted-foreground px-4 py-3 text-xs">
                          {log.reason ?? '—'}
                        </td>
                        <td className="text-muted-foreground px-4 py-3 text-xs">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
