"use client";

import { motion } from "framer-motion";
import {
  Mic,
  Volume2,
  Upload,
  PhoneOff,
  Maximize2,
  MicOff,
} from "lucide-react";
import { Message } from "../../../hooks/useChat";

interface VoiceModeProps {
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

export function VoiceMode({
  messages,
  isListening,
  isSpeaking,
  isSupported,
  startListening,
  stopListening,
  speak,
  stopSpeaking,
}: VoiceModeProps) {
  // Default is MUTED — click to unmute/speak, click again to mute
  const handleMicClick = () => {
    if (isListening) {
      stopListening(); // currently listening → click = mute
    } else {
      startListening(); // currently muted → click = unmute/listen
    }
  };

  const handleSpeakLast = () => {
    const lastAiMessage = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!lastAiMessage) return;
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(lastAiMessage.content);
    }
  };

  const lastAiMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const caption = lastAiMessage
    ? lastAiMessage.content
        .replace(/```[\s\S]*?```/g, "[code block]")
        .slice(0, 100) + (lastAiMessage.content.length > 100 ? "..." : "")
    : "Click the mic to unmute and start speaking.";

  return (
    <div className="h-full bg-white dark:bg-[#0F1117] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col relative shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-6 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isListening ? "bg-indigo-500 animate-pulse" : isSpeaking ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            ></span>
            Voice Mode
          </h2>
          <p className="text-gray-500 text-sm ml-4">
            {!isSupported
              ? "Use Chrome or Edge for voice support"
              : isListening
                ? "Listening... speak now"
                : isSpeaking
                  ? "AI is speaking..."
                  : "Muted — click mic to speak"}
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Visualizer Orb */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              scale: isListening || isSpeaking ? [1, 1.6, 1] : [1, 1.2, 1],
              opacity:
                isListening || isSpeaking ? [0.2, 0.5, 0.2] : [0.05, 0.2, 0.05],
            }}
            transition={{
              duration: isListening || isSpeaking ? 2 : 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-80 h-80 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/20"
          />
          <motion.div
            animate={{
              scale: isListening || isSpeaking ? [1, 1.4, 1] : [1, 1.1, 1],
              opacity:
                isListening || isSpeaking ? [0.3, 0.6, 0.3] : [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: isListening || isSpeaking ? 1.5 : 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute w-72 h-72 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: isListening
                ? [
                    "0 0 80px rgba(99,102,241,0.6)",
                    "0 0 120px rgba(99,102,241,0.9)",
                    "0 0 80px rgba(99,102,241,0.6)",
                  ]
                : isSpeaking
                  ? [
                      "0 0 80px rgba(34,197,94,0.5)",
                      "0 0 120px rgba(34,197,94,0.8)",
                      "0 0 80px rgba(34,197,94,0.5)",
                    ]
                  : [
                      "0 0 40px rgba(99,102,241,0.2)",
                      "0 0 60px rgba(99,102,241,0.3)",
                      "0 0 40px rgba(99,102,241,0.2)",
                    ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-56 h-56 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-blue-500 dark:from-indigo-500 dark:via-purple-600 dark:to-blue-600 blur-xl opacity-60 dark:opacity-80 z-0"
          />
          <motion.div
            animate={{ scale: [0.95, 1, 0.95] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-indigo-300 via-purple-400 to-blue-400 dark:from-indigo-400 dark:via-purple-500 dark:to-blue-500 shadow-inner z-10 opacity-90 mix-blend-multiply dark:mix-blend-screen"
          />
        </div>

        {/* Caption */}
        <div className="mt-12 text-center max-w-md px-6">
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed">
            "{caption}"
          </p>
          <div className="flex justify-center gap-1 mt-4 h-4 items-end">
            {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isListening || isSpeaking ? [4, h * 4, 4] : 4,
                }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 bg-indigo-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 pb-10">
        <div className="flex items-center justify-between max-w-sm mx-auto bg-white dark:bg-[#1A1C24] rounded-full p-2 px-6 border border-gray-200 dark:border-gray-800 shadow-xl">
          {/* Mic button:
              - Default (muted): shows MicOff icon in gray → click to start listening
              - Listening (unmuted): shows Mic icon in indigo → click to stop/mute */}
          <button
            onClick={handleMicClick}
            disabled={!isSupported}
            className={`p-4 rounded-full text-white transition-all shadow-lg hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed ${
              isListening
                ? "bg-indigo-600 shadow-indigo-600/30 hover:bg-indigo-500"
                : "bg-gray-500 shadow-gray-500/30 hover:bg-gray-400"
            }`}
          >
            {isListening ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>

          <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-4"></div>

          {/* Speaker — replay last AI message */}
          <button
            onClick={handleSpeakLast}
            disabled={
              messages.filter((m) => m.role === "assistant").length === 0
            }
            className={`p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full disabled:opacity-40 disabled:cursor-not-allowed ${
              isSpeaking
                ? "text-green-500"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Upload className="w-5 h-5" />
          </button>

          <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-4"></div>

          {/* End call */}
          <button
            onClick={() => {
              stopListening();
              stopSpeaking();
            }}
            className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all border border-red-500/20 hover:border-red-500"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
