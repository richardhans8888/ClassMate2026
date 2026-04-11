'use client'

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

  const handleDeleteSession = (sessionId: string) => {
    if (sessionId === activeSessionId) {
      newChat()
    }
  }

  return (
    <div className="bg-muted h-full w-full overflow-hidden px-6 py-4 transition-colors duration-300 md:px-8 lg:py-6">
      <div className="relative z-10 mx-auto h-full max-w-5xl">
        <div className="border-border bg-card flex h-full overflow-hidden rounded-2xl border shadow-sm">
          {/* Session Sidebar — desktop only */}
          <div className="hidden md:flex">
            <SessionSidebar
              activeSessionId={activeSessionId}
              onSelectSession={switchSession}
              onNewChat={newChat}
              onDeleteSession={handleDeleteSession}
            />
          </div>

          {/* Chat Interface */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              isLoadingHistory={isLoadingHistory}
              error={error}
              sendMessage={sendMessage}
              onNewChat={newChat}
            />
          </div>
        </div>
      </div>

      {/* Ambient Background Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-primary/10 absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[120px]" />
        <div className="bg-primary/10 absolute right-[-10%] bottom-[-20%] h-[50%] w-[50%] rounded-full blur-[120px]" />
      </div>
    </div>
  )
}
