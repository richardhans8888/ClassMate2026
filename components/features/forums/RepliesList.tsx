'use client'

import { formatDate } from '@/lib/format'

export interface Reply {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    email: string
    profile?: {
      displayName?: string | null
    } | null
  }
}

interface RepliesListProps {
  replies: Reply[]
}

export function RepliesList({ replies }: RepliesListProps) {
  if (replies.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No replies yet. Be the first to respond!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-foreground text-lg font-bold">{replies.length} Answers</h3>

      {replies.map((reply) => {
        const authorName =
          reply.user.profile?.displayName ?? reply.user.email.split('@')[0] ?? 'Anonymous'

        return (
          <div key={reply.id} className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-foreground text-sm font-medium">{authorName}</h4>
                  <p className="text-muted-foreground text-xs">{formatDate(reply.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="text-foreground text-sm leading-relaxed whitespace-pre-line">
              {reply.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
