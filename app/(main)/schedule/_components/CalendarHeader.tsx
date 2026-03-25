'use client'

import { Button } from '@/components/ui/button'
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

interface CalendarHeaderProps {
  monthLabel: string
  onPrev: () => void
  onNext: () => void
  onNewEvent: () => void
}

export function CalendarHeader({ monthLabel, onPrev, onNext, onNewEvent }: CalendarHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-600 p-2 text-white">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Schedule</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{monthLabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="rounded-lg" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="rounded-lg" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          onClick={onNewEvent}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>
    </div>
  )
}
