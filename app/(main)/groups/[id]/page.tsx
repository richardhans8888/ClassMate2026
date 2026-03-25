'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { GroupNavSidebar } from './_components/GroupNavSidebar'
import { GroupHeader } from './_components/GroupHeader'
import { GroupMessageFeed } from './_components/GroupMessageFeed'
import { GroupComposer } from './_components/GroupComposer'
import { GroupMembersSidebar } from './_components/GroupMembersSidebar'
import { GroupFilesSidebar } from './_components/GroupFilesSidebar'
import type { ChatMessage, GroupInfo, Member } from './_components/types'

const groupInfo: GroupInfo = {
  id: '404',
  name: 'Advanced Macroeconomics',
  subtitle: 'Prepare for Midterm Exam',
  membersOnline: 12,
  streak: '4h 20m',
}

const members: Member[] = [
  {
    id: 1,
    name: 'Alex',
    role: 'Scholar',
    status: 'online',
    avatar: '/avatars/alex.jpg',
    isSpeaking: true,
  },
  {
    id: 2,
    name: 'Sarah',
    role: 'Novice',
    status: 'online',
    avatar: '/avatars/sarah.jpg',
    isSpeaking: false,
  },
  {
    id: 3,
    name: 'Mike',
    role: 'Level 2',
    status: 'online',
    avatar: '/avatars/mike.jpg',
    isSpeaking: false,
  },
  {
    id: 4,
    name: 'Jessica',
    role: 'Level 3',
    status: 'online',
    avatar: '/avatars/jessica.jpg',
    isSpeaking: false,
  },
  {
    id: 5,
    name: 'David',
    role: 'Scholar',
    status: 'online',
    avatar: '/avatars/david.jpg',
    isSpeaking: false,
  },
  {
    id: 6,
    name: 'Emily',
    role: 'Novice',
    status: 'offline',
    avatar: '/avatars/emily.jpg',
    isSpeaking: false,
  },
]

const initialMessages: ChatMessage[] = [
  {
    id: 'system-1',
    type: 'system',
    content: 'Session started at 14:00 by Alex (Scholar)',
    timestamp: '14:00',
  },
  {
    id: 1,
    type: 'text',
    sender: { name: 'Alex', role: 'Scholar', avatar: '/avatars/alex.jpg' },
    content:
      "Has anyone started on the IS-LM model problem set yet? I'm getting stuck on question 3 regarding the liquidity trap.",
    timestamp: '14:02',
  },
  {
    id: 2,
    type: 'text',
    sender: { name: 'You', role: 'Novice', avatar: '/avatars/me.jpg' },
    content:
      'Yeah, I just finished it. The trick is to account for the government spending multiplier first before shifting the curve.',
    timestamp: '14:05',
    isMe: true,
  },
  {
    id: 3,
    type: 'file',
    sender: { name: 'Sarah', role: 'Novice', avatar: '/avatars/sarah.jpg' },
    content: 'Here is a helpful PDF I found that explains the shifts in the curve visually.',
    attachment: { type: 'pdf', name: 'IS-LM_Model_Explained.pdf', size: '2.4 MB' },
    timestamp: '14:08',
  },
  {
    id: 4,
    type: 'text',
    sender: { name: 'Mike', role: 'Level 2', avatar: '/avatars/mike.jpg' },
    content: "I'm hopping into the voice channel if anyone wants to discuss the graph live.",
    timestamp: '14:15',
  },
]

export default function GroupChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showFiles, setShowFiles] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const files = messages.filter((m) => !!m.attachment)
  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) => {
        const text = (m.content ?? '') + ' ' + (m.attachment?.name ?? '')
        return text.toLowerCase().includes(searchQuery.toLowerCase())
      })
    : messages

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function handleSendMessage() {
    if (!inputValue.trim()) return
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'text',
      sender: { name: 'You', role: 'Novice', avatar: '/avatars/me.jpg' },
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }
    setMessages([...messages, newMessage])
    setInputValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white font-sans text-gray-900 dark:bg-[#0F1115] dark:text-white">
      <GroupNavSidebar
        onBack={() => router.push('/groups')}
        onToggleSidebar={() => setShowSidebar((s) => !s)}
        onToggleFiles={() => setShowFiles((s) => !s)}
      />

      <div className="relative flex flex-1 flex-col bg-gray-50/50 dark:bg-[#0F1115]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-purple-500/5 blur-[120px] dark:bg-purple-900/10"></div>
          <div className="absolute right-[-10%] bottom-[-20%] h-[50%] w-[50%] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-900/10"></div>
        </div>

        <GroupHeader
          groupInfo={groupInfo}
          searchOpen={searchOpen}
          searchQuery={searchQuery}
          filteredCount={filteredMessages.length}
          onSearchOpen={() => setSearchOpen(true)}
          onSearchClose={() => {
            setSearchOpen(false)
            setSearchQuery('')
          }}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setShowSidebar((s) => !s)}
          onToggleFiles={() => setShowFiles(true)}
          onBack={() => router.push('/groups')}
        />

        <GroupMessageFeed messages={filteredMessages} scrollRef={scrollRef} />

        <GroupComposer
          inputValue={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showSidebar && (
        <GroupMembersSidebar members={members} membersOnline={groupInfo.membersOnline} />
      )}

      {showFiles && <GroupFilesSidebar files={files} onClose={() => setShowFiles(false)} />}
    </div>
  )
}
