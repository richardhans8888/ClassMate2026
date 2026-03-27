'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const COLOR_OPTIONS = [
  'bg-primary',
  'bg-semantic-success',
  'bg-secondary',
  'bg-semantic-warning',
  'bg-semantic-error',
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
  'w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground'

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
      <DialogContent className="border-border bg-card border">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-muted-foreground text-sm">
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
                className={`h-6 w-6 rounded ${c} ${color === c ? 'ring-ring ring-offset-card ring-2 ring-offset-2' : ''}`}
                aria-label={c}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-lg" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
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
