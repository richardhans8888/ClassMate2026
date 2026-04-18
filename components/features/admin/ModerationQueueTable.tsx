'use client'

import { useState } from 'react'
import { Bot } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export interface EnrichedFlag {
  id: string
  contentType: string
  contentId: string
  reason: string
  status: string
  createdAt: string
  reporter: { name: string | null; email: string } | null
  contentPreview: string | null
}

interface ModerationQueueTableProps {
  flags: EnrichedFlag[]
  onRemoveFlag: (flagId: string) => void
  onActionSuccess?: () => Promise<void>
}

function contentTypeLabel(contentType: string): string {
  if (contentType === 'post') return 'Forum Post'
  if (contentType === 'reply') return 'Forum Reply'
  if (contentType === 'material') return 'Study Material'
  return contentType
}

function isAiFlag(reason: string): boolean {
  return reason.startsWith('AI auto-flag:')
}

export function ModerationQueueTable({
  flags,
  onRemoveFlag,
  onActionSuccess,
}: ModerationQueueTableProps) {
  const [loadingFlagId, setLoadingFlagId] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<{
    flag: EnrichedFlag
    action: 'dismiss' | 'remove'
  } | null>(null)
  const [actionReason, setActionReason] = useState('')

  function openReasonDialog(flag: EnrichedFlag, action: 'dismiss' | 'remove') {
    setActionReason('')
    setPendingAction({ flag, action })
  }

  function closeReasonDialog() {
    setPendingAction(null)
    setActionReason('')
  }

  async function confirmAction() {
    if (!pendingAction) return
    const { flag, action } = pendingAction
    const reason = actionReason.trim() || undefined
    closeReasonDialog()

    setLoadingFlagId(flag.id)
    try {
      if (action === 'remove') {
        const deleteUrl =
          flag.contentType === 'post'
            ? `/api/forums/posts/${flag.contentId}`
            : flag.contentType === 'reply'
              ? `/api/forums/replies/${flag.contentId}`
              : null

        if (deleteUrl) {
          const deleteRes = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
          })
          if (!deleteRes.ok) {
            const data = (await deleteRes.json()) as { error?: string }
            if (deleteRes.status !== 404) {
              throw new Error(data.error ?? 'Failed to delete content')
            }
          }
        }
      }

      const res = await fetch('/api/moderation/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId: flag.id, action, reason }),
      })

      if (!res.ok && !(action === 'remove' && res.status === 409)) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to resolve flag')
      }

      const labels: Record<string, string> = {
        dismiss: 'Flag dismissed',
        remove: 'Content deleted and flag resolved',
      }
      toast.success(labels[action])
      onRemoveFlag(flag.id)
      await onActionSuccess?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoadingFlagId(null)
    }
  }

  const actionLabel = pendingAction?.action === 'remove' ? 'Delete' : 'Dismiss'
  const actionVariant = pendingAction?.action === 'remove' ? 'destructive' : 'default'

  if (flags.length === 0) {
    return (
      <p className="text-muted-foreground px-4 py-8 text-center text-sm">
        No pending flags. The queue is clear.
      </p>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-border bg-muted border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Content Preview</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
              <th className="px-4 py-3 font-semibold">Reporter</th>
              <th className="px-4 py-3 font-semibold">Flagged</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flags.map((flag) => {
              const isLoading = loadingFlagId === flag.id
              const reporterName =
                flag.reporter?.name ?? flag.reporter?.email?.split('@')[0] ?? 'Unknown'
              const aiFlag = isAiFlag(flag.reason)

              return (
                <tr key={flag.id} className="border-border border-b align-top last:border-b-0">
                  <td className="px-4 py-3">
                    <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs font-medium">
                      {contentTypeLabel(flag.contentType)}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    {flag.contentPreview ? (
                      <p className="text-foreground line-clamp-3 text-xs leading-relaxed">
                        {flag.contentPreview}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-xs italic">Content unavailable</p>
                    )}
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {aiFlag && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          <Bot className="h-3 w-3" />
                          AI detected
                        </span>
                      )}
                      <p className="text-muted-foreground text-xs">{flag.reason}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-foreground text-xs font-medium">{reporterName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(flag.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        disabled={isLoading}
                        onClick={() => openReasonDialog(flag, 'dismiss')}
                      >
                        Dismiss
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        disabled={isLoading}
                        onClick={() => openReasonDialog(flag, 'remove')}
                      >
                        {isLoading ? 'Working…' : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!pendingAction} onOpenChange={(open) => !open && closeReasonDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{actionLabel} — add a reason</DialogTitle>
            <DialogDescription>
              Optionally explain why this flag is being{' '}
              {pendingAction?.action === 'remove' ? 'deleted' : 'dismissed'}. This is recorded in
              the audit log.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value.slice(0, 500))}
              placeholder="e.g. No policy violation found. Flag dismissed."
              rows={3}
              className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
            <p className="text-muted-foreground text-xs">{actionReason.length}/500 — optional</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeReasonDialog}>
                Cancel
              </Button>
              <Button type="button" variant={actionVariant} onClick={confirmAction}>
                {actionLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
