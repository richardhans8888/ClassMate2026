"use client";

import { motion } from 'framer-motion';
import { Mic, Volume2, Upload, PhoneOff, Maximize2 } from 'lucide-react';

export function VoiceMode() {
  return (
    <div className="h-full bg-[#0F1117] rounded-3xl overflow-hidden border border-gray-800 flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-center p-6 z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Voice Mode
          </h2>
          <p className="text-gray-500 text-sm ml-4">Listening active</p>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Glowing Orb */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ripple 1 */}
          <motion.div 
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0
            }}
            className="absolute w-80 h-80 rounded-full bg-indigo-500/10 border border-indigo-500/20"
          />
          
          {/* Outer Ripple 2 */}
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute w-72 h-72 rounded-full bg-indigo-500/10 border border-indigo-500/30"
          />

          {/* Core Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 60px rgba(99,102,241,0.4)",
                "0 0 100px rgba(99,102,241,0.6)",
                "0 0 60px rgba(99,102,241,0.4)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-56 h-56 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 blur-xl opacity-80 z-0"
          />
          
          {/* Solid Core */}
          <motion.div 
            animate={{ 
              scale: [0.95, 1, 0.95],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-blue-500 shadow-inner z-10 opacity-90 mix-blend-screen"
          />
        </div>

        {/* Captions */}
        <div className="mt-12 text-center max-w-md px-6">
          <p className="text-gray-300 text-lg font-medium leading-relaxed">
            "I can clarify the probability density function if you'd like."
          </p>
          <div className="flex justify-center gap-1 mt-4 h-4 items-end">
            {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [4, h * 4, 4] }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity,
                  delay: i * 0.1 
                }}
                className="w-1 bg-indigo-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 pb-10">
        <div className="flex items-center justify-between max-w-sm mx-auto bg-[#1A1C24] rounded-full p-2 px-6 border border-gray-800 shadow-2xl">
          <button className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-all shadow-lg shadow-indigo-600/30 hover:scale-105">
            <Mic className="w-6 h-6" />
          </button>
          
          <div className="h-8 w-[1px] bg-gray-700 mx-4"></div>
          
          <button className="p-3 text-gray-400 hover:text-white transition-colors hover:bg-gray-800 rounded-full">
            <Volume2 className="w-5 h-5" />
          </button>
          
          <button className="p-3 text-gray-400 hover:text-white transition-colors hover:bg-gray-800 rounded-full">
            <Upload className="w-5 h-5" />
          </button>
          
          <div className="h-8 w-[1px] bg-gray-700 mx-4"></div>
          
          <button className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all border border-red-500/20 hover:border-red-500">
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
