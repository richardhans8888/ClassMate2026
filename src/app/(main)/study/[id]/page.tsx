"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  MessageSquare,
  Mic,
  Monitor,
  Undo,
  Image as ImageIcon,
  Type,
  Pencil,
  Share2,
  ArrowLeft,
} from "lucide-react";

export default function StudyRoomPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-[calc(100vh-64px)] bg-[#0F1115] text-white overflow-hidden flex flex-col">
      <header className="h-16 border-b border-gray-800 px-6 flex items-center justify-between bg-[#151921]">
        <div className="flex items-center gap-4">
          <Link href="/forums">
            <Button
              variant="ghost"
              size="sm"
              className="bg-[#1E2330] hover:bg-[#252b3b] text-gray-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-lg leading-tight">Whiteboard 1</h1>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-emerald-500 font-bold">Live</span>
              <span>•</span>
              <span>ID: 892-110</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
            <Share2 className="w-4 h-4 mr-2" /> Share Screen
          </Button>
          <Link href={`/session/${params.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 hover:bg-[#1E2330]"
            >
              <Mic className="w-4 h-4 mr-2" /> Join Voice
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Whiteboard */}
        <div className="flex-1 relative bg-[#0C1018] border-r border-gray-900">
          {/* Left tool rail */}
          <div className="absolute left-6 top-6 z-10 bg-[#151921] rounded-2xl border border-gray-800 p-2 flex flex-col gap-2">
            <Tool icon={Pencil} label="Draw" active />
            <Tool icon={Undo} label="Undo" />
            <Tool icon={Type} label="Text" />
            <Tool icon={ImageIcon} label="Image" />
          </div>

          {/* Board grid */}
          <div className="absolute inset-0 p-8">
            <div className="w-full h-full rounded-2xl border border-gray-800 bg-[linear-gradient(#1b2438_1px,transparent_1px),linear-gradient(90deg,#1b2438_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>

          {/* Bottom toolbar */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10">
            <div className="px-3 py-1.5 rounded-lg bg-[#1E2330] text-xs text-gray-300">
              Whiteboard Controls
            </div>
            <div className="w-px h-6 bg-white/10" />
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm">
              Share Screen
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[#1E2330] text-sm hover:bg-[#2A3040]">
              Cursor
            </button>
          </div>
        </div>

        {/* Right sidebar: AI + Chat */}
        <aside className="w-[360px] bg-[#151921] border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">AI Study Buddy</h3>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-lg bg-[#1E2330] flex items-center justify-center text-gray-300 hover:bg-[#2A3040]">
                  <Mic className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-lg bg-[#1E2330] flex items-center justify-center text-gray-300 hover:bg-[#2A3040]">
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-[#1E2330] rounded-xl p-4 border border-blue-500/30">
              <div className="text-xs text-blue-300 font-semibold mb-1">
                Definition Found
              </div>
              <div className="text-sm text-gray-200 font-medium">
                Quantum Entanglement
              </div>
              <p className="text-xs text-gray-400 mt-1">
                A phenomenon where particles share linked states regardless of
                distance.
              </p>
            </div>

            <div className="bg-[#1E2330] rounded-xl p-4 border border-gray-800">
              <div className="text-xs text-gray-400 mb-1">Resource</div>
              <div className="text-sm text-gray-200 font-medium">
                Schrodinger&apos;s Equation PDF
              </div>
              <p className="text-xs text-gray-500 mt-1">
                12 pages • Cornell University
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask a follow-up question..."
                className="w-full bg-[#1E2330] border border-gray-700 rounded-xl py-3 pl-4 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Tool({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-[#1E2330] text-gray-300 hover:bg-[#2A3040]"
      }`}
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
