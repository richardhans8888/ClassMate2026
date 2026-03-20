'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ForumPostDetail } from '@/components/features/forums/ForumPostDetail'
import { RepliesList } from '@/components/features/forums/RepliesList'
import { ReplyForm } from '@/components/features/forums/ReplyForm'
import { SummarizeButton } from '@/components/features/forums/SummarizeButton'

interface Post {
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

export default function ForumPostPage() {
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReplies = useCallback(async () => {
    try {
      const response = await fetch(`/api/forums/replies?postId=${postId}`)
      if (response.ok) {
        const data = await response.json()
        setReplies(data)
      }
    } catch (err) {
      console.error('Failed to fetch replies:', err)
    }
  }, [postId])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Fetch post
        const postResponse = await fetch(`/api/forums/posts/${postId}`)
        if (!postResponse.ok) {
          if (postResponse.status === 404) {
            throw new Error('Post not found')
          }
          throw new Error('Failed to load post')
        }
        const postData = await postResponse.json()
        setPost(postData)

        // Fetch replies
        await fetchReplies()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchData()
    }
  }, [postId, fetchReplies])

  // Build thread content for summarization
  const threadContent = post
    ? [
        `Title: ${post.title}`,
        `Author: ${post.user.profile?.displayName || post.user.email}`,
        `Content: ${post.content}`,
        '',
        'Replies:',
        ...replies.map(
          (r) => `- ${r.user.profile?.displayName || r.user.email.split('@')[0]}: ${r.content}`
        ),
      ].join('\n')
    : ''

  if (loading) {
    return (
      <div className="container mx-auto flex max-w-4xl items-center justify-center px-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500 dark:text-gray-400">Loading discussion...</span>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/forums"
          className="mb-6 inline-flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forums
        </Link>
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-12 dark:border-red-900 dark:bg-red-950">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="mt-4 text-lg font-medium text-red-700 dark:text-red-300">
            {error || 'Post not found'}
          </p>
          <Link href="/forums">
            <Button variant="outline" className="mt-4">
              Back to Forums
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/forums"
        className="mb-6 inline-flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forums
      </Link>

      {/* Main Post */}
      <div className="mb-8">
        <ForumPostDetail post={post} />
      </div>

      {/* AI Summary Button */}
      {(post._count.replies > 0 || post.content.length > 200) && (
        <div className="mb-8">
          <SummarizeButton threadContent={threadContent} />
        </div>
      )}

      {/* Reply Form */}
      <ReplyForm postId={postId} onReplyCreated={fetchReplies} />

      {/* Replies List */}
      <RepliesList replies={replies} />
    </div>
  )
}
