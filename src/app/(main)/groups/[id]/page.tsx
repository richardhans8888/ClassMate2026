"use client";

import { useState, useEffect, useRef } from "react";
import {
  Users,
  Search,
  MoreVertical,
  Smile,
  Plus,
  Send,
  FileText,
  Download,
  Volume2,
  Flame,
  FolderOpen,
  Settings,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Mock Data matching the screenshot
const currentUser = {
  id: "me",
  name: "You",
  avatar: "/avatars/me.jpg",
  role: "Novice",
};

const groupInfo = {
  id: "404",
  name: "Advanced Macroeconomics",
  subtitle: "Prepare for Midterm Exam",
  membersOnline: 12,
  streak: "4h 20m",
};

const members = [
  {
    id: 1,
    name: "Alex",
    role: "Scholar",
    status: "online",
    avatar: "/avatars/alex.jpg",
    isSpeaking: true,
  },
  {
    id: 2,
    name: "Sarah",
    role: "Novice",
    status: "online",
    avatar: "/avatars/sarah.jpg",
    isSpeaking: false,
  },
  {
    id: 3,
    name: "Mike",
    role: "Level 2",
    status: "online",
    avatar: "/avatars/mike.jpg",
    isSpeaking: false,
  },
  {
    id: 4,
    name: "Jessica",
    role: "Level 3",
    status: "online",
    avatar: "/avatars/jessica.jpg",
    isSpeaking: false,
  },
  {
    id: 5,
    name: "David",
    role: "Scholar",
    status: "online",
    avatar: "/avatars/david.jpg",
    isSpeaking: false,
  },
  {
    id: 6,
    name: "Emily",
    role: "Novice",
    status: "offline",
    avatar: "/avatars/emily.jpg",
    isSpeaking: false,
  },
];

const initialMessages = [
  {
    id: "system-1",
    type: "system",
    content: "Session started at 14:00 by Alex (Scholar)",
    timestamp: "14:00",
  },
  {
    id: 1,
    sender: { name: "Alex", role: "Scholar", avatar: "/avatars/alex.jpg" },
    content:
      "Has anyone started on the IS-LM model problem set yet? I'm getting stuck on question 3 regarding the liquidity trap.",
    timestamp: "14:02",
    type: "text",
  },
  {
    id: 2,
    sender: { name: "You", role: "Novice", avatar: "/avatars/me.jpg" },
    content:
      "Yeah, I just finished it. The trick is to account for the government spending multiplier first before shifting the curve.",
    timestamp: "14:05",
    type: "text",
    isMe: true,
  },
  {
    id: 3,
    sender: { name: "Sarah", role: "Novice", avatar: "/avatars/sarah.jpg" },
    content:
      "Here is a helpful PDF I found that explains the shifts in the curve visually.",
    attachment: {
      type: "pdf",
      name: "IS-LM_Model_Explained.pdf",
      size: "2.4 MB",
    },
    timestamp: "14:08",
    type: "file",
  },
  {
    id: 4,
    sender: { name: "Mike", role: "Level 2", avatar: "/avatars/mike.jpg" },
    content:
      "I'm hopping into the voice channel if anyone wants to discuss the graph live.",
    timestamp: "14:15",
    type: "text",
  },
];

export default function GroupChatPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showFiles, setShowFiles] = useState(false);
  const files = messages.filter((m) => !!m.attachment);
  const [groupVoiceJoined, setGroupVoiceJoined] = useState(false);
  const [groupVoiceMuted, setGroupVoiceMuted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: { name: "You", role: "Novice", avatar: "/avatars/me.jpg" },
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredMessages = searchQuery.trim()
    ? messages.filter((m: any) => {
        const text = (m.content || "") + " " + (m.attachment?.name || "");
        return text.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : messages;

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#0F1115] text-gray-900 dark:text-white overflow-hidden font-sans">
      {/* Left Sidebar (Navigation) */}
      <aside className="w-20 bg-gray-50 dark:bg-[#0B0D10] border-r border-gray-200 dark:border-white/5 flex flex-col items-center py-6 gap-8 z-20">
        {/* Back/Exit Button */}
        <button
          onClick={() => router.push("/groups")}
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E2330] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-white/10 transition shadow-sm"
          title="Exit Group"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-6 w-full items-center">
          <button
            onClick={() => setShowSidebar((s) => !s)}
            title="Toggle members"
            className="relative group cursor-pointer w-10 h-10 rounded-full bg-indigo-100 dark:bg-[#1E2330] flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all duration-300"
          >
            <Users className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowFiles((s) => !s)}
            title="Files"
            className="w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#1E2330] flex items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-white transition"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-auto flex flex-col gap-6 items-center">
          <div className="w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#1E2330] flex items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-white transition cursor-pointer">
            <Settings className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-white dark:bg-[#0B0D10] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-gray-50/50 dark:bg-[#0F1115]">
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 dark:bg-purple-900/10 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 dark:bg-indigo-900/10 blur-[120px]"></div>
        </div>

        {/* Top Header */}
        <header className="h-20 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-8 bg-white/80 dark:bg-[#151921]/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <span className="font-bold text-xl">M</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
                  {groupInfo.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5 uppercase tracking-wide">
                  GROUP {groupInfo.id}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium">
                {groupInfo.subtitle}
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {groupInfo.membersOnline} Members Online
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-[#1E2330] border border-orange-100 dark:border-white/5 shadow-sm">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-200">
                {groupInfo.streak} Streak
              </span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2"></div>
            {!searchOpen ? (
              <button
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white"
                onClick={() => setSearchOpen(true)}
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1E2330] border border-gray-200 dark:border-white/10 rounded-full px-3 py-1.5">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  placeholder="Search messages"
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-gray-200 w-48"
                />
                {searchQuery && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    {filteredMessages.length}
                  </span>
                )}
                <button
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  title="Close"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white"
                  title="More"
                >
                  <MoreVertical className="w-5 h-5" />
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
                <DropdownMenuItem onClick={() => router.push("/groups")}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <span>Leave Group</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8" ref={scrollRef}>
          <div className="flex justify-center sticky top-0 z-10 pointer-events-none">
            <span className="px-4 py-1.5 rounded-full bg-gray-100/80 dark:bg-[#1E2330]/80 backdrop-blur-sm text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5 shadow-sm">
              Today, October 24
            </span>
          </div>

          {filteredMessages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div
                  key={msg.id}
                  className="flex justify-center my-6 opacity-60"
                >
                  <p className="text-xs font-medium text-gray-400 italic flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                    {msg.content}
                    <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                  </p>
                </div>
              );
            }

            const isMe = msg.isMe;

            return (
              <div
                key={msg.id}
                className={`flex gap-4 ${isMe ? "justify-end" : "justify-start"} group`}
              >
                {!isMe && (
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 border-2 border-white dark:border-white/10 shadow-sm mt-1">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                      {msg.sender?.name[0]}
                    </div>
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-[65%] ${isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    {!isMe && (
                      <>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {msg.sender?.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 font-medium border border-gray-200 dark:border-white/5">
                          {msg.sender?.role}
                        </span>
                      </>
                    )}
                    <span className="text-[10px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {msg.timestamp}
                    </span>
                    {isMe && (
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        You
                      </span>
                    )}
                  </div>

                  <div
                    className={`
                      p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm relative
                      ${
                        isMe
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm"
                          : "bg-white dark:bg-[#1E2330] text-gray-700 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-white/5"
                      }
                    `}
                  >
                    {msg.content}

                    {msg.attachment && (
                      <div className="mt-4 flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-black/30 transition cursor-pointer group/file">
                        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 group-hover/file:text-red-600 dark:group-hover/file:text-red-300 transition border border-red-100 dark:border-red-500/20">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {msg.attachment.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {msg.attachment.size} • PDF Document
                          </p>
                        </div>
                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isMe && (
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 border-2 border-white dark:border-white/10 shadow-sm mt-1">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                      Y
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <div className="h-24 px-8 py-6 bg-white dark:bg-[#151921] border-t border-gray-200 dark:border-white/5 flex items-center gap-4 z-20">
          <button className="p-2.5 rounded-full bg-gray-100 dark:bg-[#1E2330] text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-white/10 transition border border-gray-200 dark:border-white/5">
            <Plus className="w-5 h-5" />
          </button>

          <div className="flex-1 relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message to #general..."
              className="w-full h-12 bg-gray-50 dark:bg-[#0F1115] border border-gray-200 dark:border-white/5 rounded-full px-6 text-[15px] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-white transition">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-3 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:scale-105 active:scale-95 duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showSidebar && (
        <div className="w-80 bg-white dark:bg-[#151921] border-l border-gray-200 dark:border-white/5 hidden xl:flex flex-col p-6 overflow-y-auto z-20 shadow-[-5px_0_30px_-10px_rgba(0,0,0,0.1)]">
          {/* Group Voice (lightweight, compact, purple-themed) */}
          <div className="rounded-3xl bg-gray-900 dark:bg-[#151B28] p-6 border border-gray-800 dark:border-white/5 mb-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-sm">
                  Group Voice
                </span>
              </div>
              {groupVoiceJoined ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 tracking-wide">
                  CONNECTED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-gray-500/10 border border-gray-500/20 text-[10px] font-bold text-gray-300 tracking-wide">
                  IDLE
                </span>
              )}
            </div>

            <div className="flex -space-x-3 mb-4 px-2 relative z-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-gray-900 dark:border-[#151B28] bg-gray-700 overflow-hidden relative shadow-md transform hover:-translate-y-1 transition duration-200"
                >
                  <div
                    className={`w-full h-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${i === 1 ? "from-blue-500 to-indigo-500" : i === 2 ? "from-purple-500 to-pink-500" : "from-emerald-500 to-teal-500"}`}
                  >
                    {i === 1 ? "A" : i === 2 ? "S" : "M"}
                  </div>
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 dark:border-[#151B28] bg-[#1E2330] flex items-center justify-center text-xs text-gray-400 font-bold shadow-md">
                +2
              </div>
            </div>

            <div className="space-y-4">
              <Link href={`/groups/${String(params.id)}/voice`}>
                <button className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 group-hover:shadow-purple-500/20">
                  Open Group Voice Page
                </button>
              </Link>
            </div>
          </div>

          {/* Online Members */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
                Online Members
                <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                  {groupInfo.membersOnline}
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              {members
                .filter((m) => m.status === "online")
                .map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-white dark:border-white/5 shadow-sm">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300">
                          {member.name[0]}
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#151921]"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-white transition">
                        {member.name}
                      </p>
                      <p
                        className={`text-[10px] ${
                          member.role === "Scholar"
                            ? "text-amber-600 dark:text-amber-500"
                            : member.role === "Novice"
                              ? "text-gray-500 dark:text-gray-500"
                              : "text-blue-500 dark:text-blue-400"
                        } font-medium flex items-center gap-1`}
                      >
                        {member.role}
                        {member.role === "Scholar" && (
                          <span className="text-[10px]">🎓</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Offline Members */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                Offline — 4
              </h3>
            </div>

            <div className="space-y-4">
              {members
                .filter((m) => m.status === "offline")
                .map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 opacity-60 group cursor-pointer hover:opacity-100 transition p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden grayscale border border-gray-100 dark:border-white/5">
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-400">
                          {member.name[0]}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600 font-medium">
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
        <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-[#101624] border-l border-gray-200 dark:border-white/5 p-6 z-30 shadow-[-5px_0_40px_-10px_rgba(0,0,0,0.2)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
              Files in Chat
            </span>
            <button
              onClick={() => setShowFiles(false)}
              className="px-2 py-1 rounded-md text-xs text-gray-500 hover:text-white hover:bg-white/10 transition"
            >
              Close
            </button>
          </div>
          <div className="space-y-3">
            {files.length === 0 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                No files yet
              </div>
            ) : (
              files.map((m) => (
                <div
                  key={String(m.id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5"
                >
                  <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {m.attachment?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {m.attachment?.size} • PDF Document
                    </p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
