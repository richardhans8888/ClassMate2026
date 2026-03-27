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
        <span className="border-border bg-muted/80 text-muted-foreground rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm">
          Today, October 24
        </span>
      </div>

      {messages.map((msg) => {
        if (msg.type === 'system') {
          return (
            <div key={msg.id} className="my-6 flex justify-center opacity-60">
              <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium italic">
                <span className="bg-border h-[1px] w-8"></span>
                {msg.content}
                <span className="bg-border h-[1px] w-8"></span>
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
              <div className="border-card bg-muted mt-1 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 shadow-sm">
                <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-sm font-bold">
                  {msg.sender?.name[0] ?? '?'}
                </div>
              </div>
            )}

            <div className={`flex max-w-[65%] flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="mb-1.5 flex items-center gap-2 px-1">
                {!isMe && (
                  <>
                    <span className="text-foreground text-sm font-bold">{msg.sender?.name}</span>
                    <span className="border-border bg-muted text-muted-foreground rounded-full border px-2 py-0.5 text-[10px] font-medium">
                      {msg.sender?.role}
                    </span>
                  </>
                )}
                <span className="text-muted-foreground text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100">
                  {msg.timestamp}
                </span>
                {isMe && <span className="text-foreground text-sm font-bold">You</span>}
              </div>

              <div
                className={`relative rounded-2xl p-4 text-[15px] leading-relaxed shadow-sm ${
                  isMe
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'border-border bg-card text-foreground rounded-tl-sm border'
                }`}
              >
                {msg.content}

                {msg.attachment && (
                  <div className="group/file border-border bg-muted hover:bg-muted/80 mt-4 flex cursor-pointer items-center gap-4 rounded-lg border p-3 transition">
                    <div className="border-semantic-error/30 bg-semantic-error/10 text-semantic-error rounded-lg border p-2.5 transition">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-bold">
                        {msg.attachment.name}
                      </p>
                      <p className="text-muted-foreground text-xs font-medium">
                        {msg.attachment.size} • PDF Document
                      </p>
                    </div>
                    <button className="text-muted-foreground hover:bg-card hover:text-foreground rounded-full p-2 transition">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isMe && (
              <div className="border-card bg-muted mt-1 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 shadow-sm">
                <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-sm font-bold">
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
