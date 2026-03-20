'use client'

import { Button } from '@/components/ui/button'
import { ArrowBigUp } from 'lucide-react'

interface Reply {
  id: string
  content: string
  upvotes: number
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

export function RepliesList({ replies }: RepliesListProps) {
  if (replies.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        No replies yet. Be the first to respond!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{replies.length} Answers</h3>

      {replies.map((reply) => {
        const authorName =
          reply.user.profile?.displayName ?? reply.user.email.split('@')[0] ?? 'Anonymous'

        return (
          <div
            key={reply.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {authorName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(reply.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-300">
              {reply.content}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg px-0 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <ArrowBigUp className="mr-1 h-5 w-5" />
                <span>{reply.upvotes} Helpful</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg px-0 text-gray-500 dark:text-gray-400"
              >
                Reply
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
