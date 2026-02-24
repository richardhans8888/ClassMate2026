"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mic, MicOff, Volume2, PhoneOff } from "lucide-react";

export default function GroupVoicePage() {
  const router = useRouter();
  const params = useParams();
  const groupId = String(params.id || "");

  const [isMicOn, setIsMicOn] = useState(true);
  const [volume, setVolume] = useState(80);
  const [callSeconds, setCallSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const participants = [
    { id: 1, name: "You", initials: "You" },
    { id: 2, name: "Sarah", initials: "S" },
    { id: 3, name: "Alex", initials: "A" },
    { id: 4, name: "Mike", initials: "M" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-[#0F1115] text-gray-900 dark:text-white overflow-hidden relative">
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute -top-40 -right-40 w-[45vw] h-[45vw] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[55vw] h-[55vw] rounded-full bg-indigo-900/15 blur-[120px]" />
      </div>

      <div className="relative h-full min-h-[calc(100vh-64px)] flex flex-col px-6">
        <div className="fixed top-[64px] left-0 right-0 z-30 flex items-center justify-between px-6 h-14 bg-white/80 dark:bg-[#0F1115]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
              GV
            </div>
            <div>
              <div className="text-sm font-semibold">Group Voice</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Group {groupId}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-purple-600 text-white">
              {String(Math.floor(callSeconds / 60)).padStart(2, "0")}:
              {String(callSeconds % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 pt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {participants.map((p) => (
              <div
                key={p.id}
                className="w-[160px] h-[120px] rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#151B28] shadow flex flex-col items-center justify-center relative"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {p.initials}
                </div>
                <div className="mt-2 text-xs font-semibold">{p.name}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-purple-50 dark:bg-[#16122a] px-4 py-3 rounded-full border border-purple-200/70 dark:border-white/10 shadow">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${isMicOn ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300"}`}
              aria-label="Toggle Mic"
            >
              {isMicOn ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-white/5 border border-purple-200/70 dark:border-white/10">
              <Volume2 className="w-4 h-4 text-purple-700 dark:text-gray-300" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-32 accent-purple-600"
              />
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-white/15 mx-1.5"></div>
            <button
              onClick={() => router.push(`/groups/${groupId}`)}
              className="px-4 h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white font-semibold"
            >
              <PhoneOff className="w-5 h-5 mr-1" />
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
