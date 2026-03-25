'use client'

import { Users, FolderOpen, Settings, ArrowLeft } from 'lucide-react'

interface GroupNavSidebarProps {
  onBack: () => void
  onToggleSidebar: () => void
  onToggleFiles: () => void
}

export function GroupNavSidebar({ onBack, onToggleSidebar, onToggleFiles }: GroupNavSidebarProps) {
  return (
    <aside className="z-20 flex w-20 flex-col items-center gap-8 border-r border-gray-200 bg-gray-50 py-6 dark:border-white/5 dark:bg-[#0B0D10]">
      <button
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-[#1E2330] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
        title="Exit Group"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="flex w-full flex-col items-center gap-6">
        <button
          onClick={onToggleSidebar}
          title="Toggle members"
          className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-all duration-300 hover:bg-indigo-600 hover:text-white dark:bg-[#1E2330] dark:text-indigo-400"
        >
          <Users className="h-5 w-5" />
        </button>

        <button
          onClick={onToggleFiles}
          title="Files"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-indigo-600 dark:hover:bg-[#1E2330] dark:hover:text-white"
        >
          <FolderOpen className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-auto flex flex-col items-center gap-6">
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-indigo-600 dark:hover:bg-[#1E2330] dark:hover:text-white">
          <Settings className="h-5 w-5" />
        </div>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-[#0B0D10]">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>
    </aside>
  )
}
