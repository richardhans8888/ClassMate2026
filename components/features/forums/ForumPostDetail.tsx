'use client'

import { Button } from '@/components/ui/button'
import { ArrowBigUp, MessageSquare, Eye, Share2, MoreHorizontal } from 'lucide-react'

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

export function ForumPostDetail({ post }: ForumPostDetailProps) {
  const authorName = post.user.profile?.displayName ?? post.user.email.split('@')[0] ?? 'Anonymous'
  const authorRole = post.user.role === 'TUTOR' ? 'Tutor' : 'Student'

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="p-6 md:p-8">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{authorName}</h3>
              <p className="text-xs text-gray-500">
                {authorRole} &bull; {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {post.category}
            </span>
            <Button variant="ghost" size="icon" className="rounded-lg text-gray-400">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">{post.title}</h1>

        <div className="prose mb-6 max-w-none whitespace-pre-line text-gray-700">
          {post.content}
        </div>

        {post.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-6">
            <Button variant="ghost" className="rounded-lg px-2 text-gray-600 hover:text-blue-600">
              <ArrowBigUp className="mr-1 h-6 w-6" />
              <span className="font-medium">{post.upvotes}</span>
            </Button>
            <div className="flex items-center text-gray-500">
              <MessageSquare className="mr-2 h-5 w-5" />
              <span>{post._count.replies} Replies</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Eye className="mr-2 h-5 w-5" />
              <span>{post.views} Views</span>
            </div>
          </div>
          <Button variant="ghost" className="rounded-lg text-gray-500">
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
