'use client'

import { ChatInterface } from 'components/features/ai-tutor/ChatInterface'
import { useChat } from '../../../hooks/useChat'

export default function AITutorPage() {
  const { messages, isLoading, error, sendMessage } = useChat()

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-50 p-4 transition-colors duration-300 lg:p-6 dark:bg-[#05050A]">
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
        <div className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-purple-200/40 mix-blend-multiply blur-[120px] dark:bg-purple-900/20 dark:mix-blend-screen" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[50%] w-[50%] rounded-full bg-indigo-200/40 mix-blend-multiply blur-[120px] dark:bg-indigo-900/20 dark:mix-blend-screen" />
      </div>
    </div>
  )
}
