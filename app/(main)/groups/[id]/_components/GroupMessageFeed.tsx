'use client'

import type { RefObject } from 'react'
import { FileText, Download } from 'lucide-react'
import type { ChatMessage } from './types'

interface GroupMessageFeedProps {
  messages: ChatMessage[]
  scrollRef: RefObject<HTMLDivElement | null>
}

export function GroupMessageFeed({ messages, scrollRef }: GroupMessageFeedProps) {
  return (
    <div className="flex-1 space-y-8 overflow-y-auto p-8" ref={scrollRef}>
      <div className="pointer-events-none sticky top-0 z-10 flex justify-center">
        <span className="rounded-full border border-gray-200 bg-gray-100/80 px-4 py-1.5 text-xs font-medium text-gray-500 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-[#1E2330]/80 dark:text-gray-400">
          Today, October 24
        </span>
      </div>

      {messages.map((msg) => {
        if (msg.type === 'system') {
          return (
            <div key={msg.id} className="my-6 flex justify-center opacity-60">
              <p className="flex items-center gap-2 text-xs font-medium text-gray-400 italic">
                <span className="h-[1px] w-8 bg-gray-300 dark:bg-gray-700"></span>
                {msg.content}
                <span className="h-[1px] w-8 bg-gray-300 dark:bg-gray-700"></span>
              </p>
            </div>
          )
        }

        const isMe = msg.isMe

        return (
          <div
            key={msg.id}
            className={`flex gap-4 ${isMe ? 'justify-end' : 'justify-start'} group`}
          >
            {!isMe && (
              <div className="mt-1 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm dark:border-white/10 dark:bg-gray-700">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                  {msg.sender?.name[0] ?? '?'}
                </div>
              </div>
            )}

            <div className={`flex max-w-[65%] flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="mb-1.5 flex items-center gap-2 px-1">
                {!isMe && (
                  <>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {msg.sender?.name}
                    </span>
                    <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:border-white/5 dark:bg-white/10 dark:text-gray-300">
                      {msg.sender?.role}
                    </span>
                  </>
                )}
                <span className="text-[10px] font-medium text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
                  {msg.timestamp}
                </span>
                {isMe && (
                  <span className="text-sm font-bold text-gray-900 dark:text-white">You</span>
                )}
              </div>

              <div
                className={`relative rounded-2xl p-4 text-[15px] leading-relaxed shadow-sm ${
                  isMe
                    ? 'rounded-tr-sm bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                    : 'rounded-tl-sm border border-gray-100 bg-white text-gray-700 dark:border-white/5 dark:bg-[#1E2330] dark:text-gray-200'
                }`}
              >
                {msg.content}

                {msg.attachment && (
                  <div className="group/file mt-4 flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-3 transition hover:bg-gray-100 dark:border-white/5 dark:bg-black/20 dark:hover:bg-black/30">
                    <div className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-500 transition group-hover/file:text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:group-hover/file:text-red-300">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                        {msg.attachment.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {msg.attachment.size} • PDF Document
                      </p>
                    </div>
                    <button className="rounded-full p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isMe && (
              <div className="mt-1 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm dark:border-white/10 dark:bg-gray-700">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                  Y
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
