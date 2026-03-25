'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ForumCard } from './ForumCard'
import { Loader2, AlertCircle, MessageSquarePlus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { FORUM_CATEGORIES } from '@/lib/constants/forum'

interface ForumPost {
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
    profile?: {
      displayName?: string | null
      major?: string | null
    } | null
  }
  tags: { id: string; name: string }[]
  _count: {
    replies: number
  }
}

interface RecommendedThread {
  id: string
  title: string
  category: string
  reason: string
}

interface ForumListProps {
  initialCategory?: string
}

export function ForumList({ initialCategory = 'all' }: ForumListProps) {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [recommendations, setRecommendations] = useState<RecommendedThread[]>([])
  const [recommendationsLoading, setRecommendationsLoading] = useState(true)
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      setError(null)

      try {
        const url =
          category && category !== 'all'
            ? `/api/forums/posts?category=${encodeURIComponent(category)}`
            : '/api/forums/posts'

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }

        const data = (await response.json()) as { posts: ForumPost[] }
        setPosts(data.posts ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category])

  useEffect(() => {
    async function fetchRecommendations() {
      setRecommendationsLoading(true)
      setRecommendationsError(null)
      try {
        const response = await fetch('/api/recommendations/threads')
        const data = (await response.json()) as {
          recommendations?: RecommendedThread[]
          error?: string
        }

        if (!response.ok) {
          throw new Error(data.error ?? 'Failed to load recommendations')
        }

        setRecommendations(data.recommendations ?? [])
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load recommendations'
        setRecommendationsError(message)
      } finally {
        setRecommendationsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.name.toLowerCase().includes(query))
    )
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Discussion Forums</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ask questions, share knowledge, and learn together.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <Link href="/forums/create">
            <Button className="shrink-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <MessageSquarePlus className="mr-2 h-4 w-4" /> New Discussion
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="scrollbar-hide mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {FORUM_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat.value
                ? 'bg-blue-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recommended Threads</h3>
        {recommendationsLoading && (
          <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading recommendations...
          </div>
        )}

        {!recommendationsLoading && recommendationsError && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{recommendationsError}</p>
        )}

        {!recommendationsLoading && !recommendationsError && recommendations.length === 0 && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            No recommendations yet. Start posting to personalize this list.
          </p>
        )}

        {!recommendationsLoading && !recommendationsError && recommendations.length > 0 && (
          <div className="mt-3 space-y-2">
            {recommendations.slice(0, 5).map((recommendation) => (
              <Link
                key={recommendation.id}
                href={`/forums/${recommendation.id}`}
                className="block rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:border-blue-500 dark:border-gray-700"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {recommendation.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {recommendation.category} • {recommendation.reason}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-500 dark:text-gray-400">Loading discussions...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-12 dark:border-red-900 dark:bg-red-950">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="mt-4 text-lg font-medium text-red-700 dark:text-red-400">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setCategory(category)} // Triggers refetch
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-12 dark:border-gray-700 dark:bg-gray-800">
          <MessageSquarePlus className="h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            {searchQuery ? 'No discussions match your search' : 'No discussions yet'}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? 'Try a different search term' : 'Be the first to start a discussion!'}
          </p>
          {!searchQuery && (
            <Link href="/forums/create">
              <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                Start a Discussion
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Posts Grid */}
      {!loading && !error && filteredPosts.length > 0 && (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <ForumCard
              key={post.id}
              id={post.id}
              title={post.title}
              author={
                post.user.profile?.displayName ?? post.user.email.split('@')[0] ?? 'Anonymous'
              }
              category={post.category}
              replies={post._count.replies}
              views={post.views}
              upvotes={post.upvotes}
              tags={post.tags.map((t) => t.name)}
              createdAt={formatDate(post.createdAt)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
