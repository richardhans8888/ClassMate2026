import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { requireModerator, requireAdmin } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'
import { ModerationQueueTable } from '@/components/features/admin/ModerationQueueTable'
import type { EnrichedFlag } from '@/components/features/admin/ModerationQueueTable'

const ACTION_LABELS: Record<string, string> = {
  FLAG_CREATED: 'Report Created',
  FLAG_RESOLVED: 'Report Resolved',
  CONTENT_DELETED: 'Content Deleted',
}

const TARGET_TYPE_LABELS: Record<string, string> = {
  FlaggedContent: 'Report',
  ForumPost: 'Forum Post',
  ForumReply: 'Forum Reply',
  StudyMaterial: 'Study Material',
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

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [flags, logs, resolvedTodayCount] = await Promise.all([
    prisma.flaggedContent.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        reporter: { select: { name: true, email: true } },
      },
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
    prisma.flaggedContent.count({
      where: {
        status: { in: ['resolved', 'dismissed'] },
        resolvedAt: { gte: todayStart },
      },
    }),
  ])

  // Batch-fetch content previews for all pending flags
  const postIds = flags.filter((f) => f.contentType === 'post').map((f) => f.contentId)
  const replyIds = flags.filter((f) => f.contentType === 'reply').map((f) => f.contentId)

  const [posts, replies] = await Promise.all([
    postIds.length > 0
      ? prisma.forumPost.findMany({
          where: { id: { in: postIds } },
          select: { id: true, title: true, content: true },
        })
      : Promise.resolve([]),
    replyIds.length > 0
      ? prisma.forumReply.findMany({
          where: { id: { in: replyIds } },
          select: { id: true, content: true },
        })
      : Promise.resolve([]),
  ])

  const postMap = new Map(posts.map((p) => [p.id, p]))
  const replyMap = new Map(replies.map((r) => [r.id, r]))

  const enrichedFlags: EnrichedFlag[] = flags.map((flag) => {
    let contentPreview: string | null = null
    if (flag.contentType === 'post') {
      const post = postMap.get(flag.contentId)
      if (post) {
        contentPreview = `${post.title} — ${post.content}`.slice(0, 200)
      }
    } else if (flag.contentType === 'reply') {
      const reply = replyMap.get(flag.contentId)
      if (reply) {
        contentPreview = reply.content.slice(0, 200)
      }
    }

    return {
      id: flag.id,
      contentType: flag.contentType,
      contentId: flag.contentId,
      reason: flag.reason,
      status: flag.status,
      createdAt: flag.createdAt.toISOString(),
      reporter: flag.reporter ? { name: flag.reporter.name, email: flag.reporter.email } : null,
      contentPreview,
    }
  })

  return (
    <div className="container mx-auto space-y-10 px-6 py-8 md:px-8">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="border-border bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Pending Reports
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold">{enrichedFlags.length}</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Resolved Today
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold">{resolvedTodayCount}</p>
        </div>
      </div>

      {/* Pending Reports */}
      <section>
        <h1 className="text-foreground text-2xl font-bold">Moderation Queue</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Pending reported content requiring review. Use Dismiss to clear false positives or Delete
          to remove content and resolve the report.
        </p>

        <div className="border-border bg-card mt-6 overflow-hidden rounded-lg border">
          <ModerationQueueTable flags={enrichedFlags} />
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
                  <th className="px-4 py-3 font-semibold">Content</th>
                  <th className="px-4 py-3 font-semibold">Actor</th>
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
                            {TARGET_TYPE_LABELS[log.targetType] ?? log.targetType}
                          </span>
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
