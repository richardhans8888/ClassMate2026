'use client'

import { Button } from '@/components/ui/button'
import { Clock, Pencil, Trash2 } from 'lucide-react'
import { formatEventTime } from './types'
import type { EventItem } from './types'

interface EventListProps {
  events: EventItem[]
  loading: boolean
  onEdit: (event: EventItem) => void
  onDelete: (id: string) => void
}

export function EventList({ events, loading, onEdit, onDelete }: EventListProps) {
  const sorted = events.slice().sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="mt-8">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <Clock className="h-4 w-4" /> Upcoming
      </h2>
      <div className="space-y-3">
        {sorted.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-[#0F1117]"
          >
            <div className="flex items-center gap-3">
              <div className={`h-6 w-2 rounded ${e.color}`} />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{e.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(e.date).toLocaleDateString()} {formatEventTime(e.startTime, e.endTime)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => onEdit(e)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => onDelete(e.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {!loading && events.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-[#0F1117] dark:text-gray-300">
            No events yet. Add your first schedule item.
          </div>
        )}
      </div>
    </div>
  )
}
