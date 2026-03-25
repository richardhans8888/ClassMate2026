'use client'

import { Button } from '@/components/ui/button'
import { ArrowBigUp, MessageSquare, Eye, Share2, MoreHorizontal } from 'lucide-react'
import { formatDate } from '@/lib/format'

interface ForumPostDetailProps {
  post: {
    id: string
    title: string
    content: string
    category: string
    views: number
    upvotes: number
    createdAt: string
    user: {
      id: string
      email: string
      role?: string
      profile?: {
        displayName?: string | null
        avatarUrl?: string | null
        major?: string | null
      } | null
    }
    tags: { id: string; name: string }[]
    _count: {
      replies: number
    }
  }
}

export function ForumPostDetail({ post }: ForumPostDetailProps) {
  const authorName = post.user.profile?.displayName ?? post.user.email.split('@')[0] ?? 'Anonymous'
  const authorRole = post.user.role === 'TUTOR' ? 'Tutor' : 'Student'

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="p-6 md:p-8">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{authorName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {authorRole} &bull; {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              {post.category}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg text-gray-400 dark:text-gray-500"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
          {post.title}
        </h1>

        <div className="prose mb-6 max-w-none whitespace-pre-line text-gray-700 dark:text-gray-300">
          {post.content}
        </div>

        {post.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              className="rounded-lg px-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <ArrowBigUp className="mr-1 h-6 w-6" />
              <span className="font-medium">{post.upvotes}</span>
            </Button>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="mr-2 h-5 w-5" />
              <span>{post._count.replies} Replies</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Eye className="mr-2 h-5 w-5" />
              <span>{post.views} Views</span>
            </div>
          </div>
          <Button variant="ghost" className="rounded-lg text-gray-500 dark:text-gray-400">
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
