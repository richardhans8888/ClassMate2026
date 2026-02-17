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
          {/* Outer Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl"
          />
          
          {/* Middle Ring */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              borderWidth: ["1px", "2px", "1px"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-48 h-48 rounded-full border border-indigo-500/30"
          />

          {/* Core Orb */}
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              background: [
                "radial-gradient(circle, rgba(99,102,241,1) 0%, rgba(79,70,229,0.8) 100%)",
                "radial-gradient(circle, rgba(129,140,248,1) 0%, rgba(67,56,202,0.8) 100%)",
                "radial-gradient(circle, rgba(99,102,241,1) 0%, rgba(79,70,229,0.8) 100%)"
              ]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-40 h-40 rounded-full shadow-[0_0_60px_rgba(99,102,241,0.6)] z-10"
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
