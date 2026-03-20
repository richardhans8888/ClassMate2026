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
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !category) {
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
          category,
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
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/forums"
        className="mb-6 inline-flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forums
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Create New Discussion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question or topic?"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                required
                disabled={loading}
              >
                <option value="">Select a category</option>
                <option value="math">Mathematics</option>
                <option value="cs">Computer Science</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="history">History</option>
                <option value="literature">Literature</option>
                <option value="languages">Languages</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., calculus, homework, derivatives"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your question or discussion topic in detail..."
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
              required
              disabled={loading}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Markdown is supported.</p>
          </div>

          <div className="flex justify-end gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Link href="/forums">
              <Button variant="outline" type="button" className="rounded-lg" disabled={loading}>
                Cancel
              </Button>
            </Link>
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
                'Post Discussion'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
