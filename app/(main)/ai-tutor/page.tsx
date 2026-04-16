'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { ChatInterface } from 'components/features/ai-tutor/ChatInterface'
import { SessionSidebar } from 'components/features/ai-tutor/SessionSidebar'
import { useChat } from '../../../hooks/useChat'

export default function AITutorPage() {
  const {
    messages,
    isLoading,
    isLoadingHistory,
    error,
    activeSessionId,
    sendMessage,
    switchSession,
    newChat,
  } = useChat()

  const [showMobileSessions, setShowMobileSessions] = useState(false)

  const handleDeleteSession = (sessionId: string) => {
    if (sessionId === activeSessionId) {
      newChat()
    }
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Session Sidebar — desktop only */}
      <div className="border-border hidden h-full w-80 min-w-[280px] shrink-0 flex-col border-r md:flex">
        <SessionSidebar
          activeSessionId={activeSessionId}
          onSelectSession={switchSession}
          onNewChat={newChat}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Chat Interface */}
      <div className="flex h-full flex-1 flex-col">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          isLoadingHistory={isLoadingHistory}
          error={error}
          sendMessage={sendMessage}
          onNewChat={newChat}
          onOpenSessions={() => setShowMobileSessions(true)}
        />
      </div>

      {/* Mobile Sessions Drawer */}
      {showMobileSessions && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileSessions(false)}
          />
          <div className="bg-card relative z-10 max-h-[70vh] overflow-hidden rounded-t-2xl">
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <span className="text-foreground font-semibold">Chat History</span>
              <button
                onClick={() => setShowMobileSessions(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 57px)' }}>
              <SessionSidebar
                activeSessionId={activeSessionId}
                onSelectSession={(id) => {
                  switchSession(id)
                  setShowMobileSessions(false)
                }}
                onNewChat={() => {
                  newChat()
                  setShowMobileSessions(false)
                }}
                onDeleteSession={handleDeleteSession}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
