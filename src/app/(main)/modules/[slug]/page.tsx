 "use client";
 
 import Link from "next/link";
 import { Button } from "@/components/ui/Button";
 import { ArrowLeft, Users, Video, Mic, MicOff, VideoOff, Monitor, List } from "lucide-react";
 import { useEffect, useRef, useState } from "react";

export default function ModuleDetailsPage({ params }: { params: { slug: string } }) {
  const slugFromParams = (params as any)?.slug;
  const raw = typeof slugFromParams === "string" ? slugFromParams : Array.isArray(slugFromParams) ? slugFromParams.join("-") : "module";
  const safe = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  const title = safe
    .split("-")
    .filter(Boolean)
    .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
  const lessons = [
    { type: "Video", title: "Introduction", duration: "4 min" },
    { type: "Updates", title: "Module Announcements", duration: "1 min" },
    { type: "Reading", title: "Syllabus", duration: "10 min" },
    { type: "Video", title: "Meet your Professor", duration: "1 min" },
    { type: "Video", title: "Design Thinking", duration: "8 min" },
    { type: "Reading", title: "Assignment Submission", duration: "10 min" },
    { type: "Video", title: "Visualization Wheel", duration: "30 min" },
    { type: "Video", title: "Graphical Heuristics", duration: "4 min" },
  ];
 
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const [activeModule, setActiveModule] = useState("Module 1");
  const activeTutors = [
    { id: "t1", name: "Dr. Alan Grant" },
    { id: "t2", name: "Sarah Jenkins" },
  ];
  const activeStudents = [
    { id: "s1", name: "You" },
    { id: "s2", name: "David Kim" },
    { id: "s3", name: "Emily Davis" },
  ];
 
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);
 
  async function startCall() {
    const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(s);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = s;
      localVideoRef.current.play().catch(() => {});
    }
  }
  function endCall() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }
  function toggleMute() {
    setMuted((v) => {
      const next = !v;
      stream?.getAudioTracks().forEach((t) => (t.enabled = !next));
      return next;
    });
  }
  function toggleCamera() {
    setCameraOn((v) => {
      const next = !v;
      stream?.getVideoTracks().forEach((t) => (t.enabled = next));
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0A0F1F] dark:text-white">
      <div className="w-full h-screen flex">
        <aside className="w-[300px] bg-gray-50 border-r border-gray-200 dark:bg-black/30 dark:border-white/10 hidden md:flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4" />
              <div className="text-sm font-semibold">Module 1</div>
            </div>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Principles</span>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-gray-500 dark:text-slate-400">Lessons</div>
            {lessons.map((l, i) => (
              <button key={i} className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 border-l-2 ${i === 0 ? "border-indigo-500 bg-gray-100 dark:bg-white/5" : "border-transparent"} transition-colors`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{l.title}</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">{l.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>
 
        <main className="flex-1 flex flex-col">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-white/10 bg-white/80 supports-[backdrop-filter]:backdrop-blur dark:bg-transparent">
            <div className="flex items-center gap-3">
              <Link href="/learn/modules">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <div className="font-semibold">{title}</div>
                  <div className="text-gray-500 dark:text-slate-400 text-xs">Live tutoring session</div>
                </div>
                <select
                  className="text-xs bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                  value={activeModule}
                  onChange={(e) => setActiveModule(e.target.value)}
                >
                  <option>Module 1</option>
                  <option>Module 2</option>
                  <option>Module 3</option>
                </select>
              </div>
            </div>
            <div className="text-gray-500 dark:text-slate-400 text-xs hidden md:block">Transcript</div>
          </div>
 
          <div className="flex-1 grid grid-rows-[1fr_auto]">
            <div className="relative bg-gray-100 dark:bg-black/40">
              <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-[1fr_280px]">
                <div className="relative">
                  <video ref={localVideoRef} muted playsInline className="w-full h-full object-cover bg-black" />
                  {!stream && (
                    <div className="absolute inset-0 grid place-items-center text-center px-6">
                      <div>
                        <div className="text-xl font-semibold mb-2">Ready to start your video call?</div>
                        <div className="text-gray-600 dark:text-slate-400 text-sm">Grant camera and microphone access to join the session with your tutor.</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden lg:block border-l border-gray-200 dark:border-white/10 bg-white dark:bg-black/20">
                  <div className="p-3 text-xs text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-white/10">
                    In Call
                  </div>
                  <div ref={remoteVideoRef} className="h-full overflow-auto">
                    <div className="p-3 space-y-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-2">
                          Tutors ({activeTutors.length})
                        </div>
                        <div className="space-y-2">
                          {activeTutors.map((u) => (
                            <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-600 dark:bg-indigo-600/30 dark:border-indigo-500/30 flex items-center justify-center text-xs font-bold dark:text-indigo-200">
                                  {u.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="text-sm text-gray-900 dark:text-white">{u.name}</div>
                              </div>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Online</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-1">
                        <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-2">
                          Students ({activeStudents.length})
                        </div>
                        <div className="space-y-2">
                          {activeStudents.map((u) => (
                            <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 text-gray-700 dark:bg-slate-600/30 dark:border-white/10 flex items-center justify-center text-xs font-bold dark:text-slate-200">
                                  {u.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="text-sm text-gray-900 dark:text-white">{u.name}</div>
                              </div>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Online</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="px-4 py-3 flex items-center gap-2 bg-white border-t border-gray-200 dark:bg-black/40 dark:border-white/10">
              {!stream ? (
                <Button onClick={startCall} className="bg-indigo-600 hover:bg-indigo-500">
                  <Video className="w-4 h-4 mr-2" />
                  Start Call
                </Button>
              ) : (
                <>
                  <Button onClick={toggleMute} variant="secondary" className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20">
                    {muted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                    {muted ? "Unmute" : "Mute"}
                  </Button>
                  <Button onClick={toggleCamera} variant="secondary" className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20">
                    {cameraOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                    {cameraOn ? "Camera Off" : "Camera On"}
                  </Button>
                  <Button onClick={endCall} variant="danger">
                    End Call
                  </Button>
                </>
              )}
              <div className="ml-auto flex items-center gap-2 text-gray-600 dark:text-slate-300 text-sm">
                <Users className="w-4 h-4" />
                <span>1 of 2</span>
                <span className="mx-2">•</span>
                <Monitor className="w-4 h-4" />
                <span>HD</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
