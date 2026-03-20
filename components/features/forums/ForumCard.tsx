import Link from 'next/link'
import { MessageSquare, Eye, ArrowBigUp } from 'lucide-react'

interface ForumCardProps {
  id: number | string
  title: string
  author: string
  category: string
  replies: number
  views: number
  upvotes: number
  tags: string[]
  createdAt: string
}

export function ForumCard({
  id,
  title,
  author,
  category,
  replies,
  views,
  upvotes,
  tags,
  createdAt,
}: ForumCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            {category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            • Posted by {author} • {createdAt}
          </span>
        </div>
      </div>

      <h3 className="mb-2 cursor-pointer text-xl font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
        <Link href={`/forums/${id}`}>{title}</Link>
      </h3>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <ArrowBigUp className="h-5 w-5" />
            <span>{upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{replies} replies</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{views} views</span>
          </div>
        </div>

        <div className="flex gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
