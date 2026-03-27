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
    <header className="border-border bg-card/80 z-10 flex h-20 items-center justify-between border-b px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="bg-primary text-primary-foreground shadow-primary/20 flex h-12 w-12 items-center justify-center rounded-lg shadow-lg">
          <span className="text-xl font-bold">M</span>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-foreground text-lg font-bold tracking-tight">{groupInfo.name}</h1>
            <span className="border-border bg-muted text-muted-foreground rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
              GROUP {groupInfo.id}
            </span>
          </div>
          <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
            {groupInfo.subtitle}
            <span className="bg-border h-1 w-1 rounded-full"></span>
            <span className="text-semantic-success">{groupInfo.membersOnline} Members Online</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!searchOpen ? (
          <button
            className="text-muted-foreground hover:bg-muted hover:text-primary rounded-full p-2.5 transition"
            onClick={onSearchOpen}
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        ) : (
          <div className="border-border bg-muted flex items-center gap-2 rounded-full border px-3 py-1.5">
            <Search className="text-muted-foreground h-4 w-4" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onSearchClose()
              }}
              placeholder="Search messages"
              className="text-foreground placeholder:text-muted-foreground w-48 bg-transparent text-sm outline-none"
            />
            {searchQuery && (
              <span className="bg-border text-muted-foreground rounded px-2 py-0.5 text-[11px]">
                {filteredCount}
              </span>
            )}
            <button
              className="text-muted-foreground hover:bg-card rounded-full p-1.5"
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
              className="text-muted-foreground hover:bg-muted hover:text-primary rounded-full p-2.5 transition"
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
