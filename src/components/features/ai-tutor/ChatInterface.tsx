"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Send, Image as ImageIcon, Plus, History, Bot, X, MessageSquare, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatInterface() {
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'user',
      content: "Can you explain the significance of the wave function in Schrödinger's equation? I'm having trouble visualizing it.",
      timestamp: "Today, 10:23 AM"
    },
    {
      id: 2,
      role: 'ai',
      content: `Certainly. In quantum mechanics, the wave function Ψ(x,t) is a mathematical description of the quantum state of an isolated quantum system.

The probability of finding a particle at a specific location is given by the square of the absolute value of the wave function:

P(x,t) = |Ψ(x,t)|²

Here is a simple Python visualization using matplotlib to plot a wave packet:`,
      code: {
        language: 'python',
        filename: 'wave_function.py',
        content: `import numpy as np
import matplotlib.pyplot as plt

# Define the wave packet
x = np.linspace(-10, 10, 1000)
psi = np.exp(-0.5 * x**2) * np.cos(5 * x)`
      }
    }
  ]);

  const historySessions = [
    { id: 1, title: "Quantum Mechanics Intro", date: "Today, 10:23 AM", active: true },
    { id: 2, title: "Calculus: Integration", date: "Yesterday, 2:45 PM", active: false },
    { id: 3, title: "React Hooks Explanation", date: "Mon, 11:30 AM", active: false },
    { id: 4, title: "French Revolution Summary", date: "Last Week", active: false },
    { id: 5, title: "Python Data Structures", date: "2 weeks ago", active: false }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0F1117] rounded-3xl overflow-hidden border border-gray-800 relative">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="text-gray-200 font-medium">AI Tutor Online</span>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-2 transition-colors text-sm ${showHistory ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
        >
          <History className="w-4 h-4" />
          <span>Session History</span>
        </button>
      </div>

      {/* History Panel Overlay */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-[70px] right-6 w-80 bg-[#1E2028] border border-gray-800 rounded-2xl shadow-2xl z-20 overflow-hidden backdrop-blur-xl"
          >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-200">Recent Sessions</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {historySessions.map((session) => (
                <button 
                  key={session.id}
                  className={`w-full text-left p-4 hover:bg-[#2A2D3A] transition-colors flex items-center gap-3 border-b border-gray-800/50 last:border-0 ${session.active ? 'bg-[#2A2D3A/50]' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${session.active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-400'}`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${session.active ? 'text-indigo-400' : 'text-gray-200'}`}>
                      {session.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{session.date}</p>
                  </div>
                  {session.active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-gray-800 bg-[#1A1C24]">
              <button className="w-full py-2 text-xs text-center text-gray-400 hover:text-white transition-colors">
                View All History
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex justify-center">
          <span className="bg-[#1E2028] text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-800">
            TODAY, 10:23 AM
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className={`max-w-[85%] space-y-4 ${msg.role === 'user' ? 'order-first' : ''}`}>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-[#2A2D3A] text-gray-100 rounded-tr-none' 
                  : 'bg-[#1E2028] text-gray-300 rounded-tl-none border border-gray-800'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content.split('\n\n').map((block, i) => (
                    <p key={i} className="mb-4 last:mb-0">{block}</p>
                  ))}
                </div>
              </div>

              {msg.code && (
                <div className="bg-[#0D0F14] rounded-xl border border-gray-800 overflow-hidden mt-3">
                  <div className="flex justify-between items-center px-4 py-2 bg-[#1A1C24] border-b border-gray-800">
                    <span className="text-xs text-gray-400 font-mono">{msg.code.filename}</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                    </div>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <pre className="font-mono text-sm text-gray-300">
                      <code>{msg.code.content}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border-2 border-emerald-500 p-0.5">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Richard" alt="User" className="w-full h-full rounded-full" />
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 pt-0">
        <div className="bg-[#1E2028] p-2 pr-2 rounded-2xl border border-gray-800 flex items-center gap-3 shadow-xl">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            placeholder="Ask a follow-up question..." 
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none text-sm"
          />

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-lg shadow-indigo-600/20">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-600 mt-3">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
