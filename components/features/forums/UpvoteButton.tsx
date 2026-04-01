'use client'

import { useState } from 'react'
import { ThumbsUp } from 'lucide-react'

interface UpvoteButtonProps {
  contentId: string
  contentType: 'post' | 'reply'
  initialUpvotes: number
  initialHasUpvoted: boolean
}

export function UpvoteButton({
  contentId,
  contentType,
  initialUpvotes,
  initialHasUpvoted,
}: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted)
  const [loading, setLoading] = useState(false)

  async function handleUpvote() {
    if (loading) return
    setLoading(true)

    // Optimistic update
    const prevUpvotes = upvotes
    const prevHasUpvoted = hasUpvoted
    setUpvotes(hasUpvoted ? upvotes - 1 : upvotes + 1)
    setHasUpvoted(!hasUpvoted)

    try {
      const endpoint =
        contentType === 'post'
          ? `/api/forums/posts/${contentId}/upvote`
          : `/api/forums/replies/${contentId}/upvote`

      const res = await fetch(endpoint, { method: 'POST' })

      if (!res.ok) {
        // Revert on error
        setUpvotes(prevUpvotes)
        setHasUpvoted(prevHasUpvoted)
        return
      }

      const data = (await res.json()) as { upvotes: number; hasUpvoted: boolean }
      setUpvotes(data.upvotes)
      setHasUpvoted(data.hasUpvoted)
    } catch {
      // Revert on network error
      setUpvotes(prevUpvotes)
      setHasUpvoted(prevHasUpvoted)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={loading}
      aria-label={hasUpvoted ? 'Remove upvote' : 'Upvote'}
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors disabled:opacity-50 ${
        hasUpvoted
          ? 'text-primary bg-primary/10 hover:bg-primary/20'
          : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
      }`}
    >
      <ThumbsUp className="h-4 w-4" />
      <span>{upvotes}</span>
    </button>
  )
}
