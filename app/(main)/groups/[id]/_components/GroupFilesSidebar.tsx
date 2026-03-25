'use client'

import { FileText, Download } from 'lucide-react'
import type { ChatMessage } from './types'

interface GroupFilesSidebarProps {
  files: ChatMessage[]
  onClose: () => void
}

export function GroupFilesSidebar({ files, onClose }: GroupFilesSidebarProps) {
  return (
    <div className="fixed top-0 right-0 z-30 h-full w-80 border-l border-gray-200 bg-white p-6 shadow-[-5px_0_40px_-10px_rgba(0,0,0,0.2)] dark:border-white/5 dark:bg-[#101624]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Files in Chat</span>
        <button
          onClick={onClose}
          className="rounded-md px-2 py-1 text-xs text-gray-500 transition hover:bg-white/10 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">No files yet</div>
        ) : (
          files.map((m) => (
            <div
              key={String(m.id)}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/5 dark:bg-black/20"
            >
              <div className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-500 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                  {m.attachment?.name}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {m.attachment?.size} • PDF Document
                </p>
              </div>
              <button className="rounded-full p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white">
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
