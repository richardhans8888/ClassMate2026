'use client'

import { toISO } from '@/lib/calendar'
import { formatEventTime } from './types'
import type { EventItem } from './types'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarCell {
  year: number
  month: number
  day: number
}

interface CalendarGridProps {
  monthMatrix: CalendarCell[]
  currentYear: number
  currentMonth: number
  events: EventItem[]
  onCellClick: (dateISO: string) => void
}

export function CalendarGrid({
  monthMatrix,
  currentYear,
  currentMonth,
  events,
  onCellClick,
}: CalendarGridProps) {
  return (
    <>
      <div className="mb-2 grid grid-cols-7 gap-2">
        {DAYS.map((d) => (
          <div key={d} className="text-muted-foreground text-center text-xs">
            {d[0]}
            <span className="hidden sm:inline">{d.slice(1)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {monthMatrix.map((cell) => {
          const dateISO = toISO(cell.year, cell.month, cell.day)
          const cellEvents = events.filter((e) => e.date === dateISO)
          const inCurrent = cell.month === currentMonth && cell.year === currentYear

          return (
            <button
              key={dateISO}
              onClick={() => onCellClick(dateISO)}
              className={`h-14 rounded-xl border p-2 text-left transition-colors sm:h-20 lg:h-28 ${
                inCurrent
                  ? 'border-border bg-card hover:border-primary'
                  : 'border-border bg-muted opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`text-xs font-medium ${inCurrent ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {cell.day}
                </div>
                <div className="flex gap-1">
                  {cellEvents.slice(0, 3).map((e) => (
                    <span key={e.id} className={`inline-block h-2 w-2 rounded-full ${e.color}`} />
                  ))}
                </div>
              </div>
              <div className="mt-2 hidden space-y-1 sm:block">
                {cellEvents.slice(0, 3).map((e) => (
                  <div key={e.id} className={`rounded px-2 py-1 text-[11px] ${e.color} text-white`}>
                    {e.title}{' '}
                    {formatEventTime(e.startTime, e.endTime)
                      ? `• ${formatEventTime(e.startTime, e.endTime)}`
                      : ''}
                  </div>
                ))}
                {cellEvents.length > 3 && (
                  <div className="text-muted-foreground text-[11px]">
                    +{cellEvents.length - 3} more
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}
