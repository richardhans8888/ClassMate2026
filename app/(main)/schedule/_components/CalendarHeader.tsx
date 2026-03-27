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
        <div className="bg-primary text-primary-foreground rounded-lg p-2">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-foreground text-xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground text-sm">{monthLabel}</p>
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
          onClick={onNewEvent}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>
    </div>
  )
}
