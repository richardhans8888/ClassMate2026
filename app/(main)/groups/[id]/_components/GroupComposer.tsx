'use client'

import { Plus, Send, Smile } from 'lucide-react'

interface GroupComposerProps {
  inputValue: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function GroupComposer({ inputValue, onChange, onSend, onKeyDown }: GroupComposerProps) {
  return (
    <div className="border-border bg-card z-20 flex h-24 items-center gap-4 border-t px-8 py-6">
      <button className="border-border bg-muted text-muted-foreground hover:bg-accent hover:text-primary rounded-full border p-2.5 transition">
        <Plus className="h-5 w-5" />
      </button>

      <div className="group relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message to #general..."
          className="border-border bg-muted text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring h-12 w-full rounded-lg border px-6 text-[15px] shadow-sm transition focus:ring-1 focus:outline-none"
        />
        <button className="text-muted-foreground hover:text-primary absolute top-1/2 right-4 -translate-y-1/2 transition">
          <Smile className="h-5 w-5" />
        </button>
      </div>

      <button
        onClick={onSend}
        disabled={!inputValue.trim()}
        className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 transform rounded-full p-3 shadow-lg transition duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  )
}
