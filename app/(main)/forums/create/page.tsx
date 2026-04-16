'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CreateForumPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/forums/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags: tags
            ? tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle moderation block
        if (data.moderation?.action === 'block') {
          toast.error(`Content blocked: ${data.moderation.reason}`)
          return
        }
        toast.error(data.error || 'Failed to create post')
        return
      }

      // Handle moderation warning
      if (data.warning) {
        toast.warning(`Post created with warning: ${data.warning.reason}`)
      } else {
        toast.success('Discussion created successfully!')
      }

      // Redirect to the new post
      const postId = data.id || data.post?.id
      router.push(postId ? `/forums/${postId}` : '/forums')
    } catch (err) {
      console.error('Create post error:', err)
      toast.error('Failed to create discussion. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-6 py-8 md:px-8">
      <Link
        href="/forums"
        className="text-muted-foreground hover:text-primary mb-6 inline-flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forums
      </Link>

      <div className="border-border bg-card rounded-xl border p-8 shadow-sm">
        <h1 className="text-foreground mb-6 text-2xl font-bold">Create New Discussion</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="text-foreground mb-1 block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question or topic?"
              className="border-border bg-muted text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="tags" className="text-foreground mb-1 block text-sm font-medium">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., calculus, homework, derivatives"
              className="border-border bg-muted text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="content" className="text-foreground mb-1 block text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your question or discussion topic in detail..."
              className="border-border bg-muted text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
              disabled={loading}
            />
            <p className="text-muted-foreground mt-2 text-xs">Markdown is supported.</p>
          </div>

          <div className="border-border flex justify-end gap-4 border-t pt-4">
            <Link href="/forums">
              <Button variant="outline" type="button" className="rounded-lg" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Discussion'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
