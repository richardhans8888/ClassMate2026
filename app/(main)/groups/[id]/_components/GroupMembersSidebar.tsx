'use client'

import type { Member } from './types'

interface GroupMembersSidebarProps {
  members: Member[]
  membersOnline: number
}

export function GroupMembersSidebar({ members, membersOnline }: GroupMembersSidebarProps) {
  const onlineMembers = members.filter((m) => m.status === 'online')
  const offlineMembers = members.filter((m) => m.status === 'offline')

  return (
    <div className="border-border bg-card z-20 hidden w-80 flex-col overflow-y-auto border-l p-6 shadow-sm xl:flex">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between px-1">
          <h3 className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
            Online Members
            <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5">
              {membersOnline}
            </span>
          </h3>
        </div>

        <div className="space-y-4">
          {onlineMembers.map((member) => (
            <div
              key={member.id}
              className="group hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg p-2 transition"
            >
              <div className="relative">
                <div className="border-border bg-muted h-10 w-10 overflow-hidden rounded-full border shadow-sm">
                  <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-sm font-bold">
                    {member.name[0]}
                  </div>
                </div>
                <div className="border-card bg-semantic-success absolute right-0 bottom-0 h-3 w-3 rounded-full border-2"></div>
              </div>
              <div>
                <p className="text-foreground group-hover:text-primary text-sm font-bold transition">
                  {member.name}
                </p>
                <p
                  className={`flex items-center gap-1 text-[10px] font-medium ${
                    member.role === 'Scholar'
                      ? 'text-semantic-warning'
                      : member.role === 'Novice'
                        ? 'text-muted-foreground'
                        : 'text-primary'
                  }`}
                >
                  {member.role}
                  {member.role === 'Scholar' && <span className="text-[10px]">🎓</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between px-1">
          <h3 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Offline — {offlineMembers.length}
          </h3>
        </div>

        <div className="space-y-4">
          {offlineMembers.map((member) => (
            <div
              key={member.id}
              className="group hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg p-2 opacity-60 transition hover:opacity-100"
            >
              <div className="relative">
                <div className="border-border bg-muted h-10 w-10 overflow-hidden rounded-full border grayscale">
                  <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-sm font-bold">
                    {member.name[0]}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">{member.name}</p>
                <p className="text-muted-foreground text-[10px] font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
