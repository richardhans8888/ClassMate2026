"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Search,
  Plus,
  ChevronDown,
  ArrowRight,
  Clock,
  FlaskConical,
  Image,
  BookOpen,
  Code,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Group = {
  id: string;
  name: string;
  subject: string;
  capacity: number;
  max: number;
  schedule: string;
  status: "Active" | "Full" | "Recruiting";
  accent: "blue" | "indigo" | "emerald" | "rose" | "purple";
  desc: string;
  privacy?: "Public" | "Private";
};

const allGroups: Group[] = [
  {
    id: "adv-calculus-ii",
    name: "Advanced Calculus II",
    subject: "Mathematics",
    capacity: 14,
    max: 20,
    schedule: "Tue, 4PM",
    status: "Active",
    accent: "blue",
    desc: "Weekly problem sets review and exam preparation.",
  },
  {
    id: "modern-history-debate",
    name: "Modern History Debate",
    subject: "History",
    capacity: 5,
    max: 10,
    schedule: "Fri, 2PM",
    status: "Recruiting",
    accent: "rose",
    desc: "Discussing key events from the 20th century.",
  },
  {
    id: "python-beginners",
    name: "Python for Beginners",
    subject: "Computer Science",
    capacity: 42,
    max: 50,
    schedule: "Mon, 6PM",
    status: "Active",
    accent: "emerald",
    desc: "Zero to Hero in Python. Covering basics, loops, and functions.",
  },
  {
    id: "organic-chem-prep",
    name: "Organic Chemistry Prep",
    subject: "Science",
    capacity: 8,
    max: 12,
    schedule: "Wed, 5PM",
    status: "Recruiting",
    accent: "purple",
    desc: "Mechanism mastery and synthesis practice problems.",
  },
  {
    id: "constitutional-law",
    name: "Constitutional Law",
    subject: "Law",
    capacity: 15,
    max: 15,
    schedule: "Thu, 1PM",
    status: "Full",
    accent: "indigo",
    desc: "Case studies and Supreme Court rulings analysis.",
  },
  {
    id: "quantum-mechanics-101",
    name: "Quantum Mechanics 101",
    subject: "Physics",
    capacity: 18,
    max: 25,
    schedule: "Fri, 10AM",
    status: "Recruiting",
    accent: "blue",
    desc: "Understanding the wave function and Schrödinger equation.",
  },
  {
    id: "cognitive-science",
    name: "Cognitive Science Group",
    subject: "Psychology",
    capacity: 7,
    max: 10,
    schedule: "Mon, 3PM",
    status: "Recruiting",
    accent: "purple",
    desc: "Exploration of the mind and intelligence processes.",
  },
];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Computer Science",
  "Literature",
  "History",
  "Physics",
  "Science",
  "Psychology",
  "Law",
];
const sortOptions = ["Most Popular", "Newest", "Soonest"];

export default function StudyGroupsPage() {
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState("All Subjects");
  const [activeSort, setActiveSort] = useState("Most Popular");
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [customGroups, setCustomGroups] = useState<Group[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formSubject, setFormSubject] = useState("Mathematics");
  const [formTheme, setFormTheme] = useState<Group["accent"]>("purple");
  const [formPrivacy, setFormPrivacy] = useState<"Public" | "Private">(
    "Public",
  );
  const [formDesc, setFormDesc] = useState("");
  const [formMax, setFormMax] = useState(12);
  const [formSchedule, setFormSchedule] = useState("TBD");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("joinedGroups");
    const name = localStorage.getItem("userName") || "";
    const storedCustom = localStorage.getItem("customGroups");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        setJoinedIds(parsed);
      } catch {}
    }
    if (storedCustom) {
      try {
        const parsed = JSON.parse(storedCustom) as Group[];
        setCustomGroups(parsed);
      } catch {}
    }
    let seed: string[] = [];
    if (name === "Alex Rivera")
      seed = ["adv-calculus-ii", "quantum-mechanics-101"];
    if (name === "Sarah Jenkins") seed = ["python-beginners"];
    setJoinedIds(seed);
    localStorage.setItem("joinedGroups", JSON.stringify(seed));
  }, []);

  const filtered = useMemo(() => {
    const source = [...allGroups, ...customGroups];
    let list = source.filter(
      (g) =>
        (activeSubject === "All Subjects" || g.subject === activeSubject) &&
        (query.trim().length === 0 ||
          g.name.toLowerCase().includes(query.toLowerCase())),
    );
    if (activeSort === "Most Popular") {
      list = list.sort((a, b) => b.capacity / b.max - a.capacity / a.max);
    } else if (activeSort === "Newest") {
      list = list.slice().reverse();
    } else if (activeSort === "Soonest") {
      list = list;
    }
    return list;
  }, [activeSubject, activeSort, query, customGroups]);

  const joined = filtered.filter((g) => joinedIds.includes(g.id));
  const discover = filtered.filter((g) => !joinedIds.includes(g.id));

  return (
    <div className="h-[calc(100vh-64px)] bg-white dark:bg-[#0F1115] text-gray-900 dark:text-white overflow-hidden flex flex-col">
      <header className="h-20 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between bg-white dark:bg-[#151921]">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight">Study Groups</h1>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-purple-400 font-bold">Community</span>
              <span>•</span>
              <span>Join or create a group</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-3 py-2 rounded-full bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="text-xs">{activeSort}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {sortOptions.map((opt) => (
                <DropdownMenuItem key={opt} onClick={() => setActiveSort(opt)}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-64 bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-500"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Create Group
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                activeSubject === s
                  ? "bg-gray-100 dark:bg-[#1E2330] border-purple-500/40 text-gray-900 dark:text-white"
                  : "bg-white dark:bg-[#151921] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E2330]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300">Your Groups</h2>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-[#1E2330]"
            onClick={() => setCreateOpen(true)}
          >
            Create Group
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {joined.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151921] p-6 text-center">
              <div className="font-bold mb-1">No groups yet</div>
              <div className="text-xs text-gray-400 mb-3">
                Join a group below to get started.
              </div>
              <Link href="/groups">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-500">
                  Browse Groups
                </Button>
              </Link>
            </div>
          ) : (
            joined.map((g) => {
              const accentClass =
                g.accent === "blue"
                  ? "from-blue-600 to-blue-500"
                  : g.accent === "indigo"
                    ? "from-indigo-600 to-indigo-500"
                    : g.accent === "emerald"
                      ? "from-emerald-600 to-emerald-500"
                      : g.accent === "rose"
                        ? "from-rose-500 to-rose-400"
                        : "from-purple-600 to-purple-500";
              const isActive = g.status === "Active";
              const SubjectIcon = (() => {
                if (g.subject === "Science") return FlaskConical;
                if (g.subject === "Computer Science") return Code;
                if (g.subject === "History") return BookOpen;
                if (g.subject === "Mathematics") return Image;
                return Image;
              })();
              return (
                <div
                  key={g.id}
                  className="group rounded-2xl overflow-hidden bg-white dark:bg-[#0E141E] border border-gray-200 dark:border-[#1E2A3A]"
                >
                  <div
                    className={`relative h-24 bg-gradient-to-br ${accentClass}`}
                  >
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,#ffffff33_1px,transparent_1px)] [background-size:20px_20px]" />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <SubjectIcon className="w-6 h-6 text-white/90" />
                    </div>
                    {isActive && (
                      <div className="absolute right-3 top-3 px-2 py-1 text-[11px] font-bold rounded-full bg-emerald-500 text-white shadow">
                        Active
                      </div>
                    )}
                  </div>
                  <div className="p-5 bg-gray-50 dark:bg-[#0F1622]">
                    <div className="text-[11px] font-bold inline-block px-2 py-1 rounded-full bg-gray-100 dark:bg-[#111A29] border border-gray-200 dark:border-[#223247] text-gray-600 dark:text-gray-300 mb-2">
                      {g.subject.toUpperCase()}
                    </div>
                    <div className="mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {g.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {g.desc}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {g.capacity}/{g.max}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {g.schedule}
                      </div>
                    </div>
                  </div>
                  <div className="px-5 pb-5 bg-gray-50 dark:bg-[#0F1622]">
                    <Link href={`/groups/${g.id}`}>
                      <button className="w-full h-10 rounded-lg border border-blue-600 text-blue-400 bg-transparent hover:bg-blue-600/10 flex items-center justify-center font-semibold">
                        Open Group <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300">
            Discover Groups
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discover.map((g) => {
            const accentClass =
              g.accent === "blue"
                ? "from-blue-600 to-blue-500"
                : g.accent === "indigo"
                  ? "from-indigo-600 to-indigo-500"
                  : g.accent === "emerald"
                    ? "from-emerald-600 to-emerald-500"
                    : g.accent === "rose"
                      ? "from-rose-500 to-rose-400"
                      : "from-purple-600 to-purple-500";
            const isFull = g.status === "Full";
            const isActive = g.status === "Active";
            const SubjectIcon = (() => {
              if (g.subject === "Science") return FlaskConical;
              if (g.subject === "Computer Science") return Code;
              if (g.subject === "History") return BookOpen;
              if (g.subject === "Mathematics") return Image;
              return Image;
            })();
            return (
              <div
                key={g.id}
                className="group rounded-2xl overflow-hidden bg-white dark:bg-[#0E141E] border border-gray-200 dark:border-[#1E2A3A]"
              >
                <div
                  className={`relative h-24 bg-gradient-to-br ${accentClass}`}
                >
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,#ffffff33_1px,transparent_1px)] [background-size:20px_20px]" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <SubjectIcon className="w-6 h-6 text-white/90" />
                  </div>
                  {isActive && (
                    <div className="absolute right-3 top-3 px-2 py-1 text-[11px] font-bold rounded-full bg-emerald-500 text-white shadow">
                      Active
                    </div>
                  )}
                </div>
                <div className="p-5 bg-gray-50 dark:bg-[#0F1622]">
                  <div className="text-[11px] font-bold inline-block px-2 py-1 rounded-full bg-gray-100 dark:bg-[#111A29] border border-gray-200 dark:border-[#223247] text-gray-600 dark:text-gray-300 mb-2">
                    {g.subject.toUpperCase()}
                  </div>
                  <div className="mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {g.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {g.desc}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {g.capacity}/{g.max}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {g.schedule}
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 bg-gray-50 dark:bg-[#0F1622]">
                  {isFull ? (
                    <button className="w-full h-10 rounded-lg border border-[#264777] text-gray-500 bg-transparent cursor-not-allowed">
                      Group Full
                    </button>
                  ) : (
                    <Link href={`/groups/${g.id}`}>
                      <button className="w-full h-10 rounded-lg border border-blue-600 text-blue-400 bg-transparent hover:bg-blue-600/10 flex items-center justify-center font-semibold">
                        Join Group <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setCreateOpen(true)}
            className="group rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151921] flex items-center justify-center p-6 hover:border-gray-400 dark:hover:border-gray-600"
          >
            <div className="text-center">
              <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#1E2330] group-hover:bg-gray-200 dark:group-hover:bg-[#252b3b] flex items-center justify-center">
                <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white" />
              </div>
              <div className="font-bold">Create a New Group</div>
              <div className="text-xs text-gray-400 mt-1">
                Start your own study circle.
              </div>
            </div>
          </button>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px] bg-[#0F1622] text-white border border-white/10">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              Fill in the details to create your study group.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Group Name</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Linear Algebra Study"
                className="w-full h-10 rounded-lg bg-[#0E141E] border border-white/10 px-3 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Subject</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full h-10 rounded-lg bg-[#0E141E] border border-white/10 px-3 text-sm"
                >
                  {subjects
                    .filter((s) => s !== "All Subjects")
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Theme</label>
                <select
                  value={formTheme}
                  onChange={(e) =>
                    setFormTheme(e.target.value as Group["accent"])
                  }
                  className="w-full h-10 rounded-lg bg-[#0E141E] border border-white/10 px-3 text-sm"
                >
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                  <option value="indigo">Indigo</option>
                  <option value="emerald">Emerald</option>
                  <option value="rose">Rose</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Privacy</label>
                <select
                  value={formPrivacy}
                  onChange={(e) =>
                    setFormPrivacy(e.target.value as "Public" | "Private")
                  }
                  className="w-full h-10 rounded-lg bg-[#0E141E] border border-white/10 px-3 text-sm"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Max Members</label>
                <input
                  type="number"
                  min={2}
                  max={200}
                  value={formMax}
                  onChange={(e) => setFormMax(parseInt(e.target.value || "12"))}
                  className="w-full h-10 rounded-lg bg-[#0E141E] border border-white/10 px-3 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Schedule</label>
              <input
                value={formSchedule}
                onChange={(e) => setFormSchedule(e.target.value)}
                placeholder="e.g., Wed, 7PM"
                className="w-full h-10 rounded-lg bg-[#0E141E] border border-white/10 px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Description</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Brief description"
                className="w-full min-h-[80px] rounded-lg bg-[#0E141E] border border-white/10 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="border-white/10"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-500"
                disabled={!formName.trim()}
                onClick={() => {
                  const newGroup: Group = {
                    id: formName.trim().toLowerCase().replace(/\\s+/g, "-"),
                    name: formName.trim(),
                    subject: formSubject,
                    capacity: 0,
                    max: formMax,
                    schedule: formSchedule,
                    status: "Recruiting",
                    accent: formTheme,
                    desc: formDesc || "No description provided.",
                    privacy: formPrivacy,
                  };
                  const next = [...customGroups, newGroup];
                  setCustomGroups(next);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("customGroups", JSON.stringify(next));
                  }
                  setCreateOpen(false);
                  setFormName("");
                  setFormDesc("");
                  setFormMax(12);
                  setFormSchedule("TBD");
                  setFormSubject("Mathematics");
                  setFormTheme("purple");
                  setFormPrivacy("Public");
                }}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
