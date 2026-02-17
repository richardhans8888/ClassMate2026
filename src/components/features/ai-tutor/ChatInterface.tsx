"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Send, Image as ImageIcon, Plus, History, Bot } from 'lucide-react';

export function ChatInterface() {
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

  return (
    <div className="flex flex-col h-full bg-[#0F1117] rounded-3xl overflow-hidden border border-gray-800 relative">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="text-gray-200 font-medium">AI Tutor Online</span>
        </div>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <History className="w-4 h-4" />
          <span>Session History</span>
        </button>
      </div>

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
