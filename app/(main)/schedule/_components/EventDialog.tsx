'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const COLOR_OPTIONS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
]

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingId: string | null
  draftDate: string | null
  title: string
  startTime: string
  endTime: string
  category: string
  description: string
  color: string
  saving: boolean
  onTitleChange: (v: string) => void
  onStartTimeChange: (v: string) => void
  onEndTimeChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onColorChange: (v: string) => void
  onSave: () => void
}

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-[#15181E] dark:text-white'

export function EventDialog({
  open,
  onOpenChange,
  editingId,
  draftDate,
  title,
  startTime,
  endTime,
  category,
  description,
  color,
  saving,
  onTitleChange,
  onStartTimeChange,
  onEndTimeChange,
  onCategoryChange,
  onDescriptionChange,
  onColorChange,
  onSave,
}: EventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onChange={(e) => onTitleChange(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Start time (e.g. 09:00)"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="End time (e.g. 10:00)"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Category (e.g. math, cs)"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className={inputClass}
          />
          <div className="flex items-center gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                className={`h-6 w-6 rounded ${c} ${color === c ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-[#0F1117]' : ''}`}
                aria-label={c}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-lg" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
