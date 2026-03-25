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
    <div className="z-20 flex h-24 items-center gap-4 border-t border-gray-200 bg-white px-8 py-6 dark:border-white/5 dark:bg-[#151921]">
      <button className="rounded-full border border-gray-200 bg-gray-100 p-2.5 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/5 dark:bg-[#1E2330] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white">
        <Plus className="h-5 w-5" />
      </button>

      <div className="group relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message to #general..."
          className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 px-6 text-[15px] text-gray-900 shadow-inner transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-white/5 dark:bg-[#0F1115] dark:text-white"
        />
        <button className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition hover:text-indigo-600 dark:hover:text-white">
          <Smile className="h-5 w-5" />
        </button>
      </div>

      <button
        onClick={onSend}
        disabled={!inputValue.trim()}
        className="transform rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-3 text-white shadow-lg shadow-indigo-500/20 transition duration-200 hover:scale-105 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  )
}
