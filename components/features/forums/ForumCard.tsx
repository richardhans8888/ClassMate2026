import Link from 'next/link'
import { MessageSquare, Eye } from 'lucide-react'
import { UpvoteButton } from './UpvoteButton'

interface ForumCardProps {
  id: number | string
  title: string
  author: string
  category: string
  replies: number
  views: number
  upvotes: number
  hasUpvoted: boolean
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
  hasUpvoted,
  tags,
  createdAt,
}: ForumCardProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-6 transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-accent text-accent-foreground rounded px-2.5 py-0.5 text-xs font-semibold">
            {category}
          </span>
          <span className="text-muted-foreground text-xs">
            • Posted by {author} • {createdAt}
          </span>
        </div>
      </div>

      <h3 className="text-foreground hover:text-primary mb-2 cursor-pointer text-xl font-semibold">
        <Link href={`/forums/${id}`}>{title}</Link>
      </h3>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-muted-foreground flex items-center gap-6 text-sm">
          <UpvoteButton
            contentId={String(id)}
            contentType="post"
            initialUpvotes={upvotes}
            initialHasUpvoted={hasUpvoted}
          />
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
            <span key={tag} className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
