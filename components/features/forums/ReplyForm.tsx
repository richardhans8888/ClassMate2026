'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ReplyFormProps {
  postId: string
  onReplyCreated?: () => void
}

export function ReplyForm({ postId, onReplyCreated }: ReplyFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Please enter a reply')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/forums/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: content.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle moderation block
        if (data.moderation?.action === 'block') {
          toast.error(`Content blocked: ${data.moderation.reason}`)
          return
        }
        toast.error(data.error || 'Failed to post reply')
        return
      }

      // Handle moderation warning
      if (data.warning) {
        toast.warning(`Reply posted with warning: ${data.warning.reason}`)
      } else {
        toast.success('Reply posted successfully!')
      }

      setContent('')
      onReplyCreated?.()
    } catch (err) {
      console.error('Reply error:', err)
      toast.error('Failed to post reply. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Post a Reply</h3>
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What are your thoughts? Add to the discussion..."
          className="mb-4 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
          disabled={loading}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Reply'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
