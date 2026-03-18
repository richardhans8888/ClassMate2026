'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Users,
  Search,
  MoreVertical,
  Smile,
  Plus,
  Send,
  FileText,
  Download,
  Flame,
  FolderOpen,
  Settings,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

// Mock Data matching the screenshot
const groupInfo = {
  id: '404',
  name: 'Advanced Macroeconomics',
  subtitle: 'Prepare for Midterm Exam',
  membersOnline: 12,
  streak: '4h 20m',
}

const members = [
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

const initialMessages = [
  {
    id: 'system-1',
    type: 'system',
    content: 'Session started at 14:00 by Alex (Scholar)',
    timestamp: '14:00',
  },
  {
    id: 1,
    sender: { name: 'Alex', role: 'Scholar', avatar: '/avatars/alex.jpg' },
    content:
      "Has anyone started on the IS-LM model problem set yet? I'm getting stuck on question 3 regarding the liquidity trap.",
    timestamp: '14:02',
    type: 'text',
  },
  {
    id: 2,
    sender: { name: 'You', role: 'Novice', avatar: '/avatars/me.jpg' },
    content:
      'Yeah, I just finished it. The trick is to account for the government spending multiplier first before shifting the curve.',
    timestamp: '14:05',
    type: 'text',
    isMe: true,
  },
  {
    id: 3,
    sender: { name: 'Sarah', role: 'Novice', avatar: '/avatars/sarah.jpg' },
    content: 'Here is a helpful PDF I found that explains the shifts in the curve visually.',
    attachment: {
      type: 'pdf',
      name: 'IS-LM_Model_Explained.pdf',
      size: '2.4 MB',
    },
    timestamp: '14:08',
    type: 'file',
  },
  {
    id: 4,
    sender: { name: 'Mike', role: 'Level 2', avatar: '/avatars/mike.jpg' },
    content: "I'm hopping into the voice channel if anyone wants to discuss the graph live.",
    timestamp: '14:15',
    type: 'text',
  },
]

export default function GroupChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showFiles, setShowFiles] = useState(false)
  const files = messages.filter((m) => !!m.attachment)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: { name: 'You', role: 'Novice', avatar: '/avatars/me.jpg' },
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'text',
      isMe: true,
    }

    setMessages([...messages, newMessage])
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredMessages = searchQuery.trim()
    ? messages.filter((m: { content?: string; attachment?: { name?: string } }) => {
        const text = (m.content || '') + ' ' + (m.attachment?.name || '')
        return text.toLowerCase().includes(searchQuery.toLowerCase())
      })
    : messages

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white font-sans text-gray-900 dark:bg-[#0F1115] dark:text-white">
      {/* Left Sidebar (Navigation) */}
      <aside className="z-20 flex w-20 flex-col items-center gap-8 border-r border-gray-200 bg-gray-50 py-6 dark:border-white/5 dark:bg-[#0B0D10]">
        {/* Back/Exit Button */}
        <button
          onClick={() => router.push('/groups')}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-[#1E2330] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          title="Exit Group"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex w-full flex-col items-center gap-6">
          <button
            onClick={() => setShowSidebar((s) => !s)}
            title="Toggle members"
            className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-all duration-300 hover:bg-indigo-600 hover:text-white dark:bg-[#1E2330] dark:text-indigo-400"
          >
            <Users className="h-5 w-5" />
          </button>

          <button
            onClick={() => setShowFiles((s) => !s)}
            title="Files"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-indigo-600 dark:hover:bg-[#1E2330] dark:hover:text-white"
          >
            <FolderOpen className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-auto flex flex-col items-center gap-6">
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-indigo-600 dark:hover:bg-[#1E2330] dark:hover:text-white">
            <Settings className="h-5 w-5" />
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-[#0B0D10]">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col bg-gray-50/50 dark:bg-[#0F1115]">
        {/* Background Gradient Effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-purple-500/5 blur-[120px] dark:bg-purple-900/10"></div>
          <div className="absolute right-[-10%] bottom-[-20%] h-[50%] w-[50%] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-900/10"></div>
        </div>

        {/* Top Header */}
        <header className="z-10 flex h-20 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-md dark:border-white/5 dark:bg-[#151921]/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-bold">M</span>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  {groupInfo.name}
                </h1>
                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase dark:border-white/5 dark:bg-white/10 dark:text-gray-400">
                  GROUP {groupInfo.id}
                </span>
              </div>
              <p className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {groupInfo.subtitle}
                <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {groupInfo.membersOnline} Members Online
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 shadow-sm md:flex dark:border-white/5 dark:bg-[#1E2330]">
              <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-200">
                {groupInfo.streak} Streak
              </span>
            </div>
            <div className="mx-2 h-8 w-[1px] bg-gray-200 dark:bg-white/10"></div>
            {!searchOpen ? (
              <button
                className="rounded-full p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                onClick={() => setSearchOpen(true)}
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 dark:border-white/10 dark:bg-[#1E2330]">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchOpen(false)
                      setSearchQuery('')
                    }
                  }}
                  placeholder="Search messages"
                  className="w-48 bg-transparent text-sm text-gray-900 outline-none dark:text-gray-200"
                />
                {searchQuery && (
                  <span className="rounded bg-gray-200 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-white/10 dark:text-gray-300">
                    {filteredMessages.length}
                  </span>
                )}
                <button
                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchQuery('')
                  }}
                  title="Close"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                  title="More"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setSearchOpen(true)}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search Messages</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSidebar((s) => !s)}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Toggle Members</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowFiles(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Open Files</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/groups')}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <span>Leave Group</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Messages Feed */}
        <div className="flex-1 space-y-8 overflow-y-auto p-8" ref={scrollRef}>
          <div className="pointer-events-none sticky top-0 z-10 flex justify-center">
            <span className="rounded-full border border-gray-200 bg-gray-100/80 px-4 py-1.5 text-xs font-medium text-gray-500 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-[#1E2330]/80 dark:text-gray-400">
              Today, October 24
            </span>
          </div>

          {filteredMessages.map((msg) => {
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
                      {msg.sender?.name[0]}
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
                    } `}
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

        {/* Composer */}
        <div className="z-20 flex h-24 items-center gap-4 border-t border-gray-200 bg-white px-8 py-6 dark:border-white/5 dark:bg-[#151921]">
          <button className="rounded-full border border-gray-200 bg-gray-100 p-2.5 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/5 dark:bg-[#1E2330] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white">
            <Plus className="h-5 w-5" />
          </button>

          <div className="group relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message to #general..."
              className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 px-6 text-[15px] text-gray-900 shadow-inner transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-white/5 dark:bg-[#0F1115] dark:text-white"
            />
            <button className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition hover:text-indigo-600 dark:hover:text-white">
              <Smile className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="transform rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-3 text-white shadow-lg shadow-indigo-500/20 transition duration-200 hover:scale-105 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showSidebar && (
        <div className="z-20 hidden w-80 flex-col overflow-y-auto border-l border-gray-200 bg-white p-6 shadow-[-5px_0_30px_-10px_rgba(0,0,0,0.1)] xl:flex dark:border-white/5 dark:bg-[#151921]">
          {/* Online Members */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between px-1">
              <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-500">
                Online Members
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600 dark:bg-white/5 dark:text-gray-400">
                  {groupInfo.membersOnline}
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              {members
                .filter((m) => m.status === 'online')
                .map((member) => (
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
                        className={`text-[10px] ${
                          member.role === 'Scholar'
                            ? 'text-amber-600 dark:text-amber-500'
                            : member.role === 'Novice'
                              ? 'text-gray-500 dark:text-gray-500'
                              : 'text-blue-500 dark:text-blue-400'
                        } flex items-center gap-1 font-medium`}
                      >
                        {member.role}
                        {member.role === 'Scholar' && <span className="text-[10px]">🎓</span>}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Offline Members */}
          <div>
            <div className="mb-4 flex items-center justify-between px-1">
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-600">
                Offline — 4
              </h3>
            </div>

            <div className="space-y-4">
              {members
                .filter((m) => m.status === 'offline')
                .map((member) => (
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
      )}

      {showFiles && (
        <div className="fixed top-0 right-0 z-30 h-full w-80 border-l border-gray-200 bg-white p-6 shadow-[-5px_0_40px_-10px_rgba(0,0,0,0.2)] dark:border-white/5 dark:bg-[#101624]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
              Files in Chat
            </span>
            <button
              onClick={() => setShowFiles(false)}
              className="rounded-md px-2 py-1 text-xs text-gray-500 transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="space-y-3">
            {files.length === 0 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400">No files yet</div>
            ) : (
              files.map((m) => (
                <div
                  key={String(m.id)}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/5 dark:bg-black/20"
                >
                  <div className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-500 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {m.attachment?.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {m.attachment?.size} • PDF Document
                    </p>
                  </div>
                  <button className="rounded-full p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
