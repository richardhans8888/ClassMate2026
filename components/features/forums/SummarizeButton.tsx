'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

interface SummarizeButtonProps {
  threadContent: string
}

export function SummarizeButton({ threadContent }: SummarizeButtonProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSummarize() {
    if (loading) return

    setLoading(true)
    setSummary(null)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread: threadContent }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize')
      }

      setSummary(data.summary)
    } catch (err) {
      console.error('Summarize error:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button
        onClick={handleSummarize}
        disabled={loading}
        variant="outline"
        className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Summarizing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Summary
          </>
        )}
      </Button>

      {summary && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">AI Thread Summary</h4>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              onClick={() => setSummary(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}
    </div>
  )
}
