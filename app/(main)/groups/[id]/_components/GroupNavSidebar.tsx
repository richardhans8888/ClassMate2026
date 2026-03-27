'use client'

import { Users, FolderOpen, Settings, ArrowLeft } from 'lucide-react'

interface GroupNavSidebarProps {
  onBack: () => void
  onToggleSidebar: () => void
  onToggleFiles: () => void
}

export function GroupNavSidebar({ onBack, onToggleSidebar, onToggleFiles }: GroupNavSidebarProps) {
  return (
    <aside className="border-border bg-muted z-20 flex w-20 flex-col items-center gap-8 border-r py-6">
      <button
        onClick={onBack}
        className="bg-card text-muted-foreground hover:bg-accent hover:text-primary flex h-10 w-10 items-center justify-center rounded-lg shadow-sm transition"
        title="Exit Group"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="flex w-full flex-col items-center gap-6">
        <button
          onClick={onToggleSidebar}
          title="Toggle members"
          className="group bg-accent text-primary hover:bg-primary hover:text-primary-foreground relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300"
        >
          <Users className="h-5 w-5" />
        </button>

        <button
          onClick={onToggleFiles}
          title="Files"
          className="text-muted-foreground hover:bg-muted/80 hover:text-primary flex h-10 w-10 items-center justify-center rounded-full transition"
        >
          <FolderOpen className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-auto flex flex-col items-center gap-6">
        <div className="text-muted-foreground hover:bg-muted/80 hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition">
          <Settings className="h-5 w-5" />
        </div>
        <div className="bg-primary h-8 w-8 rounded-full p-[2px]">
          <div className="bg-card flex h-full w-full items-center justify-center rounded-full">
            <div className="bg-semantic-success h-2 w-2 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  )
}
