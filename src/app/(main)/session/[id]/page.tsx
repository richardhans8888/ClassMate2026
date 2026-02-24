"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Smile,
  Volume2,
  PhoneOff,
  MessageSquare,
  Monitor,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function SessionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const initialPanel = searchParams.get("panel");
  const [isMicOn, setIsMicOn] = useState(true);
  const [volume, setVolume] = useState(70);
  const [callSeconds, setCallSeconds] = useState(0);
  const [activePanel, setActivePanel] = useState<
    "none" | "chat" | "whiteboard"
  >(() => {
    if (initialPanel === "chat") return "chat";
    if (initialPanel === "whiteboard") return "whiteboard";
    return "none";
  });
  const [sharingStream, setSharingStream] = useState<MediaStream | null>(null);
  const shareVideoRef = useRef<HTMLVideoElement | null>(null);
  const [userVolumes, setUserVolumes] = useState<Record<number, number>>({});
  const [contextMenu, setContextMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    pid: number | null;
  }>({ open: false, x: 0, y: 0, pid: null });

  useEffect(() => {
    if (shareVideoRef.current && sharingStream) {
      // @ts-ignore
      shareVideoRef.current.srcObject = sharingStream;
      shareVideoRef.current.play().catch(() => {});
    }
  }, [sharingStream]);

  useEffect(() => {
    const id = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  async function startShare() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      setSharingStream(stream);
    } catch {}
  }

  function stopShare() {
    sharingStream?.getTracks().forEach((t) => t.stop());
    setSharingStream(null);
  }
  const participants = [
    { id: 1, name: "You", avatar: "You", angle: -140 },
    { id: 2, name: "Sarah J.", avatar: "SJ", center: true },
    { id: 3, name: "Alex M.", avatar: "AM", angle: -20 },
    { id: 4, name: "Kenji S.", avatar: "KS", angle: 40 },
    { id: 5, name: "Elena R.", avatar: "ER", angle: 160 },
  ];
  useEffect(() => {
    const init: Record<number, number> = {};
    participants.forEach((p) => {
      init[p.id] = init[p.id] ?? 100;
    });
    setUserVolumes((prev) => (Object.keys(prev).length ? prev : init));
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-[#06090f] text-gray-900 dark:text-white overflow-hidden relative">
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute -top-40 -left-40 w-[55vw] h-[55vw] rounded-full bg-blue-900/15 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[45vw] h-[45vw] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="relative h-full min-h-[calc(100vh-64px)] flex flex-col px-6">
        <div className="fixed top-[64px] left-0 right-0 z-30 flex items-center justify-between px-6 h-14 bg-white/80 dark:bg-[#06090f]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white font-bold">
              SR
            </div>
            <div>
              <div className="text-sm font-semibold">Study Room Call</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Advanced Macroeconomics
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-600 text-white">
              {String(Math.floor(callSeconds / 60)).padStart(2, "0")}:
              {String(callSeconds % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-items-center px-2 pt-20">
          {participants.map((p) => (
            <div
              key={p.id}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                  open: true,
                  x: e.clientX,
                  y: e.clientY,
                  pid: p.id,
                });
              }}
              className={`w-[180px] h-[140px] rounded-2xl border ${p.center ? "border-teal-500" : "border-gray-200 dark:border-white/10"} bg-gray-50 dark:bg-[#0B1220] shadow-lg flex flex-col items-center justify-center relative overflow-hidden`}
            >
              <div
                className={`w-14 h-14 rounded-full border-2 ${p.center ? "border-teal-500" : "border-white/10"} bg-gray-200 dark:bg-[#0D1420] flex items-center justify-center`}
              >
                <span className="text-xs font-bold">{p.avatar}</span>
              </div>
              <div className="mt-2 text-xs font-semibold">{p.name}</div>
              <div className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/10">
                Vol {userVolumes[p.id] ?? 100}%
              </div>
              {p.center && (
                <div className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded bg-teal-600 text-white font-bold">
                  SPEAKING
                </div>
              )}
            </div>
          ))}
        </div>

        {contextMenu.open && contextMenu.pid !== null && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() =>
                setContextMenu({ open: false, x: 0, y: 0, pid: null })
              }
            />
            <div
              className="fixed z-50 w-[220px] rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B1220] shadow-2xl p-3"
              style={{ left: contextMenu.x, top: contextMenu.y }}
            >
              <div className="text-xs font-semibold mb-2">User Audio</div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={userVolumes[contextMenu.pid] ?? 100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setUserVolumes((prev) => ({
                      ...prev,
                      [contextMenu.pid!]: val,
                    }));
                  }}
                  className="w-32 accent-teal-600"
                />
                <span className="text-[10px] text-gray-600 dark:text-gray-400 w-8 text-right">
                  {userVolumes[contextMenu.pid] ?? 100}%
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  className="px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
                  onClick={() =>
                    setContextMenu({ open: false, x: 0, y: 0, pid: null })
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-3 bg-teal-50 dark:bg-[#0C1616] px-4 py-3 rounded-full border border-teal-200/60 dark:border-white/10 shadow-xl">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${isMicOn ? "bg-teal-600 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300"}`}
            >
              {isMicOn ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={sharingStream ? stopShare : startShare}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${sharingStream ? "bg-emerald-600 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300"}`}
              aria-label="Share Screen"
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 flex items-center justify-center">
              <Smile className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-white/5 border border-teal-200/60 dark:border-white/10">
              <Volume2 className="w-4 h-4 text-teal-700 dark:text-gray-300" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-32 accent-teal-600"
              />
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-white/15 mx-1.5"></div>
            <button
              onClick={() => {
                stopShare();
                router.push(`/forums`);
              }}
              className="px-4 h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white font-semibold"
            >
              <PhoneOff className="w-5 h-5 mr-1" />
              Leave
            </button>
          </div>
        </div>

        {sharingStream && (
          <div className="fixed top-[120px] left-10 w-[320px] h-[200px] bg-white dark:bg-black/60 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl z-20">
            <video
              ref={shareVideoRef}
              className="w-full h-full object-cover"
              muted
            />
            <div className="absolute top-2 left-2 text-[11px] px-2 py-1 rounded bg-emerald-600 text-white font-bold">
              Sharing
            </div>
            <button
              onClick={stopShare}
              className="absolute top-2 right-2 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 border border-gray-300 dark:border-white/10 rounded px-2 py-1 text-gray-800 dark:text-white"
            >
              Stop
            </button>
          </div>
        )}
        <div className="fixed bottom-10 right-10 w-[340px] bg-white dark:bg-[#0B1220] rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl z-20">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <div className="text-sm font-semibold">Personal Notes</div>
            <button className="text-xs text-gray-600 dark:text-gray-400">
              Expand
            </button>
          </div>
          <div className="p-4 text-sm text-gray-700 dark:text-gray-300 space-y-3">
            <p>
              Wait, did Sarah say the deadline for the Quantum Mechanics paper
              was extended to Friday?
            </p>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Type a new note...
              </span>
            </div>
          </div>
        </div>

        <div className="fixed top-[120px] right-10 flex items-center gap-2 z-20">
          <button
            onClick={() =>
              setActivePanel(activePanel === "chat" ? "none" : "chat")
            }
            className={`px-3 h-10 rounded-full border ${activePanel === "chat" ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-100 dark:bg-[#0B1220] border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200"}`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Chat
            </div>
          </button>
          <button
            onClick={() =>
              setActivePanel(
                activePanel === "whiteboard" ? "none" : "whiteboard",
              )
            }
            className={`px-3 h-10 rounded-full border ${activePanel === "whiteboard" ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-100 dark:bg-[#0B1220] border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200"}`}
          >
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4" /> Whiteboard
            </div>
          </button>
        </div>

        {activePanel !== "none" && (
          <aside className="fixed top-[120px] right-10 w-[360px] h-[calc(100vh-160px)] bg-white dark:bg-[#0B1220] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden z-20">
            <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activePanel === "chat" ? (
                  <MessageSquare className="w-4 h-4" />
                ) : (
                  <Monitor className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {activePanel === "chat" ? "Group Chat" : "Whiteboard"}
                </span>
              </div>
              <button
                onClick={() => setActivePanel("none")}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>
            {activePanel === "chat" ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="text-xs text-gray-400">Today</div>
                  <div className="space-y-3">
                    <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3">
                      <div className="text-xs text-blue-600 dark:text-blue-300 font-semibold">
                        Sarah
                      </div>
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        We’ll cover the chain rule examples next.
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg:white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3">
                      <div className="text-xs text-emerald-600 dark:text-emerald-300 font-semibold">
                        Alex
                      </div>
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        Can we go over sin(x^2) again?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-white/10">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full bg-white dark:bg-[#0D1420] border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 transition-all"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 relative">
                <div className="absolute inset-0 p-4">
                  <div className="w-full h-full rounded-xl border border-gray-200 dark:border-gray-800 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(#1b2438_1px,transparent_1px),linear-gradient(90deg,#1b2438_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 dark:bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10">
                  <div className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-xs text-gray-700 dark:text-gray-300">
                    Board Tools
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm">
                    Share
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
