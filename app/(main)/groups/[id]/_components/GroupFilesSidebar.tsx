'use client'

import { FileText, Download } from 'lucide-react'
import type { ChatMessage } from './types'

interface GroupFilesSidebarProps {
  files: ChatMessage[]
  onClose: () => void
}

export function GroupFilesSidebar({ files, onClose }: GroupFilesSidebarProps) {
  return (
    <div className="border-border bg-card fixed top-0 right-0 z-30 h-full w-80 border-l p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-foreground text-sm font-bold">Files in Chat</span>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-2 py-1 text-xs transition"
        >
          Close
        </button>
      </div>

      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="text-muted-foreground text-xs">No files yet</div>
        ) : (
          files.map((m) => (
            <div
              key={String(m.id)}
              className="border-border bg-muted flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="border-semantic-error/30 bg-semantic-error/10 text-semantic-error rounded-lg border p-2.5">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-bold">{m.attachment?.name}</p>
                <p className="text-muted-foreground text-xs font-medium">
                  {m.attachment?.size} • PDF Document
                </p>
              </div>
              <button className="text-muted-foreground hover:bg-card hover:text-foreground rounded-full p-2 transition">
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
