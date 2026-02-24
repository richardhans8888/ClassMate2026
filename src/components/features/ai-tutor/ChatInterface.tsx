"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Image as ImageIcon,
  Plus,
  History,
  Bot,
  X,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "../../../hooks/useChat";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => void;
}

export function ChatInterface({
  messages,
  isLoading,
  error,
  sendMessage,
}: ChatInterfaceProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const historySessions = [
    {
      id: 1,
      title: "Quantum Mechanics Intro",
      date: "Today, 10:23 AM",
      active: true,
    },
    {
      id: 2,
      title: "Calculus: Integration",
      date: "Yesterday, 2:45 PM",
      active: false,
    },
    {
      id: 3,
      title: "React Hooks Explanation",
      date: "Mon, 11:30 AM",
      active: false,
    },
    {
      id: 4,
      title: "French Revolution Summary",
      date: "Last Week",
      active: false,
    },
    {
      id: 5,
      title: "Python Data Structures",
      date: "2 weeks ago",
      active: false,
    },
  ];

  // Auto-scroll only the chat box
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const parseContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: {
      type: "text" | "code";
      content: string;
      language?: string;
    }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: content.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: "code",
        language: match[1] || "code",
        content: match[2],
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: "text", content: content.slice(lastIndex) });
    }

    return parts;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F1117] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 relative shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="text-gray-900 dark:text-gray-200 font-medium">
            AI Tutor Online
          </span>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-2 transition-colors text-sm ${showHistory ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
        >
          <History className="w-4 h-4" />
          <span>Session History</span>
        </button>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-[70px] right-6 w-80 bg-white/90 dark:bg-[#1E2028]/90 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-20 overflow-hidden backdrop-blur-xl"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                Recent Sessions
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {historySessions.map((session) => (
                <button
                  key={session.id}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-[#2A2D3A] transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-800/50 last:border-0 ${session.active ? "bg-indigo-50 dark:bg-[#2A2D3A]" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${session.active ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-medium truncate ${session.active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-gray-200"}`}
                    >
                      {session.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {session.date}
                    </p>
                  </div>
                  {session.active && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500"></div>
                  )}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1C24]">
              <button className="w-full py-2 text-xs text-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                View All History
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-6 space-y-8">
        {error && (
          <div className="text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
            {error}
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-50">
            <Bot className="w-10 h-10 text-indigo-400" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Ask me anything — I'm here to help you learn.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const parts = parseContent(msg.content);
          return (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] space-y-4 ${msg.role === "user" ? "order-first" : ""}`}
              >
                <div
                  className={`p-4 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 dark:bg-[#2A2D3A] text-white dark:text-gray-100 rounded-tr-none"
                      : "bg-gray-100 dark:bg-[#1E2028] text-gray-800 dark:text-gray-300 rounded-tl-none border border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed space-y-3">
                    {parts.map((part, i) =>
                      part.type === "text" ? (
                        <div key={i}>
                          {part.content.split("\n\n").map((block, j) => (
                            <p key={j} className="mb-2 last:mb-0">
                              {block}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <div
                          key={i}
                          className="bg-[#1e293b] dark:bg-[#0D0F14] rounded-xl border border-gray-700 overflow-hidden shadow-md"
                        >
                          <div className="flex justify-between items-center px-4 py-2 bg-[#0f172a] dark:bg-[#1A1C24] border-b border-gray-700">
                            <span className="text-xs text-gray-400 font-mono">
                              {part.language}
                            </span>
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
                            </div>
                          </div>
                          <div className="p-4 overflow-x-auto">
                            <pre className="font-mono text-sm text-gray-300">
                              <code>{part.content}</code>
                            </pre>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border-2 border-emerald-500 p-0.5">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Richard"
                    alt="User"
                    className="w-full h-full rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-[#1E2028] rounded-2xl rounded-tl-none p-4 border border-gray-200 dark:border-gray-800">
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="w-2 h-2 bg-indigo-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 pt-0">
        <div className="bg-gray-50 dark:bg-[#1E2028] p-2 pr-2 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none text-sm"
            disabled={isLoading}
          />
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-600 mt-3">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
