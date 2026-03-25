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
    <div className="z-20 hidden w-80 flex-col overflow-y-auto border-l border-gray-200 bg-white p-6 shadow-[-5px_0_30px_-10px_rgba(0,0,0,0.1)] xl:flex dark:border-white/5 dark:bg-[#151921]">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between px-1">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-500">
            Online Members
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600 dark:bg-white/5 dark:text-gray-400">
              {membersOnline}
            </span>
          </h3>
        </div>

        <div className="space-y-4">
          {onlineMembers.map((member) => (
            <div
              key={member.id}
              className="group flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <div className="relative">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-white bg-gray-200 shadow-sm dark:border-white/5 dark:bg-gray-700">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-sm font-bold text-gray-600 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300">
                    {member.name[0]}
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#151921]"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 transition group-hover:text-indigo-600 dark:text-gray-200 dark:group-hover:text-white">
                  {member.name}
                </p>
                <p
                  className={`flex items-center gap-1 text-[10px] font-medium ${
                    member.role === 'Scholar'
                      ? 'text-amber-600 dark:text-amber-500'
                      : member.role === 'Novice'
                        ? 'text-gray-500 dark:text-gray-500'
                        : 'text-blue-500 dark:text-blue-400'
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
          <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-600">
            Offline — {offlineMembers.length}
          </h3>
        </div>

        <div className="space-y-4">
          {offlineMembers.map((member) => (
            <div
              key={member.id}
              className="group flex cursor-pointer items-center gap-3 rounded-xl p-2 opacity-60 transition hover:bg-gray-50 hover:opacity-100 dark:hover:bg-white/5"
            >
              <div className="relative">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-100 bg-gray-200 grayscale dark:border-white/5 dark:bg-gray-700">
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-bold text-gray-400 dark:bg-gray-800">
                    {member.name[0]}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {member.name}
                </p>
                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-600">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
