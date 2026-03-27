'use client'

import { ChatInterface } from 'components/features/ai-tutor/ChatInterface'
import { useChat } from '../../../hooks/useChat'

export default function AITutorPage() {
  const { messages, isLoading, error, sendMessage } = useChat()

  return (
    <div className="bg-muted h-[calc(100vh-64px)] w-full overflow-hidden px-6 py-4 transition-colors duration-300 md:px-8 lg:py-6">
      <div className="relative z-10 mx-auto h-full max-w-4xl">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          error={error}
          sendMessage={sendMessage}
        />
      </div>

      {/* Ambient Background Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-primary/10 absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[120px]" />
        <div className="bg-primary/10 absolute right-[-10%] bottom-[-20%] h-[50%] w-[50%] rounded-full blur-[120px]" />
      </div>
    </div>
  )
}
