'use client'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog'

type EventItem = {
  id: string
  date: string
  title: string
  description?: string | null
  startTime?: string | null
  endTime?: string | null
  category?: string | null
  color: string
}

type ApiEvent = {
  id: string
  title: string
  description: string | null
  date: string
  startTime: string | null
  endTime: string | null
  category: string | null
}

const CATEGORY_TO_COLOR: Record<string, string> = {
  math: 'bg-blue-500',
  physics: 'bg-emerald-500',
  cs: 'bg-purple-500',
  chemistry: 'bg-amber-500',
  biology: 'bg-rose-500',
}

function colorFromCategory(category: string | null): string {
  if (!category) {
    return 'bg-blue-500'
  }
  return CATEGORY_TO_COLOR[category.toLowerCase()] ?? 'bg-blue-500'
}

function formatEventTime(startTime?: string | null, endTime?: string | null): string {
  if (!startTime || !endTime) {
    return ''
  }
  return `${startTime} - ${endTime}`
}

function mapApiEvent(event: ApiEvent): EventItem {
  return {
    id: event.id,
    date: new Date(event.date).toISOString().slice(0, 10),
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    category: event.category,
    color: colorFromCategory(event.category),
  }
}

export default function MySchedulePage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const [current, setCurrent] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftDate, setDraftDate] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [category, setCategory] = useState('math')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('bg-blue-500')

  async function loadEvents() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/events', { cache: 'no-store' })
      const data = (await response.json()) as { events?: ApiEvent[]; error?: string }
      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to load events')
      }
      const mapped = (data.events ?? []).map(mapApiEvent)
      setEvents(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadEvents()
  }, [])

  const monthMatrix = useMemo(() => buildMonthMatrix(current.year, current.month), [current])
  const monthLabel = useMemo(
    () =>
      new Date(current.year, current.month, 1).toLocaleString(undefined, {
        month: 'long',
        year: 'numeric',
      }),
    [current]
  )

  function openNew(dateISO: string) {
    setEditingId(null)
    setDraftDate(dateISO)
    setTitle('')
    setStartTime('')
    setEndTime('')
    setDescription('')
    setCategory('math')
    setColor('bg-blue-500')
    setOpen(true)
  }

  function openEdit(event: EventItem) {
    setEditingId(event.id)
    setDraftDate(event.date)
    setTitle(event.title)
    setStartTime(event.startTime ?? '')
    setEndTime(event.endTime ?? '')
    setDescription(event.description ?? '')
    setCategory(event.category ?? 'math')
    setColor(event.color)
    setOpen(true)
  }

  async function saveEvent() {
    if (!draftDate || !title.trim()) {
      setOpen(false)
      return
    }

    const normalizedStartTime = startTime.trim()
    const normalizedEndTime = endTime.trim()
    if (
      (normalizedStartTime && !normalizedEndTime) ||
      (!normalizedStartTime && normalizedEndTime)
    ) {
      setError('Start time and end time must both be provided.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (editingId) {
        const patchResponse = await fetch(`/api/events/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            date: new Date(`${draftDate}T00:00:00.000Z`).toISOString(),
            startTime: normalizedStartTime || null,
            endTime: normalizedEndTime || null,
            category: category.trim() || null,
          }),
        })
        const patchData = (await patchResponse.json()) as { event?: ApiEvent; error?: string }
        if (!patchResponse.ok || !patchData.event) {
          throw new Error(patchData.error ?? 'Failed to update event')
        }
        const mapped = mapApiEvent(patchData.event)
        setEvents((prev) => prev.map((event) => (event.id === editingId ? mapped : event)))
      } else {
        const postResponse = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            date: new Date(`${draftDate}T00:00:00.000Z`).toISOString(),
            startTime: normalizedStartTime || null,
            endTime: normalizedEndTime || null,
            category: category.trim() || null,
          }),
        })
        const postData = (await postResponse.json()) as { event?: ApiEvent; error?: string }
        if (!postResponse.ok || !postData.event) {
          throw new Error(postData.error ?? 'Failed to create event')
        }
        const mapped = mapApiEvent(postData.event)
        setEvents((prev) => [...prev, mapped])
      }

      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  async function deleteEvent(id: string) {
    setError(null)
    try {
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      const data = (await response.json()) as { success?: boolean; error?: string }
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Failed to delete event')
      }
      setEvents((prev) => prev.filter((event) => event.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
    }
  }

  function prevMonth() {
    setCurrent((c) => {
      const m = c.month - 1
      return m < 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: m }
    })
  }
  function nextMonth() {
    setCurrent((c) => {
      const m = c.month + 1
      return m > 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: m }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A]">
      <div className="mx-auto max-w-5xl px-6 py-8">
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
            <Button variant="outline" className="rounded-lg" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="rounded-lg" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => openNew(toISO(current.year, current.month, new Date().getDate()))}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-2 grid grid-cols-7 gap-2">
          {days.map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 dark:text-gray-400">
              {d}
            </div>
          ))}
        </div>
        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-gray-600 dark:border-gray-800 dark:bg-[#0F1117] dark:text-gray-300">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading schedule...
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {monthMatrix.map((cell) => {
              const dateISO = toISO(cell.year, cell.month, cell.day)
              const cellEvents = events.filter((e) => e.date === dateISO)
              const inCurrent = cell.month === current.month && cell.year === current.year
              return (
                <button
                  key={dateISO}
                  onClick={() => openNew(dateISO)}
                  className={`h-28 rounded-xl border p-2 text-left transition-colors ${
                    inCurrent
                      ? 'border-gray-200 bg-white hover:border-blue-500 dark:border-gray-800 dark:bg-[#0F1117]'
                      : 'border-gray-200 bg-gray-100 opacity-70 dark:border-gray-800 dark:bg-[#0D1320]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`text-xs font-medium ${inCurrent ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      {cell.day}
                    </div>
                    <div className="flex gap-1">
                      {cellEvents.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={`inline-block h-2 w-2 rounded-full ${e.color}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {cellEvents.slice(0, 3).map((e) => (
                      <div
                        key={e.id}
                        className={`rounded px-2 py-1 text-[11px] ${e.color} text-white`}
                      >
                        {e.title}{' '}
                        {formatEventTime(e.startTime, e.endTime)
                          ? `• ${formatEventTime(e.startTime, e.endTime)}`
                          : ''}
                      </div>
                    ))}
                    {cellEvents.length > 3 && (
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">
                        +{cellEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Clock className="h-4 w-4" /> Upcoming
          </h2>
          <div className="space-y-3">
            {events
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-[#0F1117]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-6 w-2 rounded ${e.color}`} />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {e.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(e.date).toLocaleDateString()}{' '}
                        {formatEventTime(e.startTime, e.endTime)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => openEdit(e)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => {
                        void deleteEvent(e.id)
                      }}
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1117]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {draftDate ? new Date(draftDate).toDateString() : ''}
              </div>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-[#15181E] dark:text-white"
              />
              <input
                placeholder="Start time (e.g. 09:00)"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-[#15181E] dark:text-white"
              />
              <input
                placeholder="End time (e.g. 10:00)"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-[#15181E] dark:text-white"
              />
              <input
                placeholder="Category (e.g. math, cs)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-[#15181E] dark:text-white"
              />
              <input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-[#15181E] dark:text-white"
              />
              <div className="flex items-center gap-2">
                {[
                  'bg-blue-500',
                  'bg-emerald-500',
                  'bg-purple-500',
                  'bg-amber-500',
                  'bg-rose-500',
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded ${c} ${color === c ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-[#0F1117]' : ''}`}
                    aria-label={c}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" className="rounded-lg" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    void saveEvent()
                  }}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function toISO(year: number, month: number, day: number) {
  const d = new Date(year, month, day)
  const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString()
  return iso.slice(0, 10)
}

function buildMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1)
  const startDow = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()
  const cells = 42
  const matrix: { year: number; month: number; day: number }[] = []
  for (let i = 0; i < cells; i++) {
    const idx = i - startDow + 1
    if (idx <= 0) {
      const day = prevMonthDays + idx
      const pm = month - 1 < 0 ? 11 : month - 1
      const py = month - 1 < 0 ? year - 1 : year
      matrix.push({ year: py, month: pm, day })
    } else if (idx > daysInMonth) {
      const day = idx - daysInMonth
      const nm = month + 1 > 11 ? 0 : month + 1
      const ny = month + 1 > 11 ? year + 1 : year
      matrix.push({ year: ny, month: nm, day })
    } else {
      matrix.push({ year, month, day: idx })
    }
  }
  return matrix
}
