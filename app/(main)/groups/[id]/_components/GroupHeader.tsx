'use client'

import { Search, Users, FileText, MoreVertical, ChevronLeft } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { GroupInfo } from './types'

interface GroupHeaderProps {
  groupInfo: GroupInfo
  searchOpen: boolean
  searchQuery: string
  filteredCount: number
  onSearchOpen: () => void
  onSearchClose: () => void
  onSearchChange: (q: string) => void
  onToggleSidebar: () => void
  onToggleFiles: () => void
  onBack: () => void
}

export function GroupHeader({
  groupInfo,
  searchOpen,
  searchQuery,
  filteredCount,
  onSearchOpen,
  onSearchClose,
  onSearchChange,
  onToggleSidebar,
  onToggleFiles,
  onBack,
}: GroupHeaderProps) {
  return (
    <header className="z-10 flex h-20 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-md dark:border-white/5 dark:bg-[#151921]/50">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
          <span className="text-xl font-bold">M</span>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              {groupInfo.name}
            </h1>
            <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase dark:border-white/5 dark:bg-white/10 dark:text-gray-400">
              GROUP {groupInfo.id}
            </span>
          </div>
          <p className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            {groupInfo.subtitle}
            <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {groupInfo.membersOnline} Members Online
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!searchOpen ? (
          <button
            className="rounded-full p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
            onClick={onSearchOpen}
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 dark:border-white/10 dark:bg-[#1E2330]">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onSearchClose()
              }}
              placeholder="Search messages"
              className="w-48 bg-transparent text-sm text-gray-900 outline-none dark:text-gray-200"
            />
            {searchQuery && (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-white/10 dark:text-gray-300">
                {filteredCount}
              </span>
            )}
            <button
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
              onClick={onSearchClose}
              title="Close"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
              title="More"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onSearchOpen}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search Messages</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleSidebar}>
              <Users className="mr-2 h-4 w-4" />
              <span>Toggle Members</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleFiles}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Open Files</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span>Leave Group</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
