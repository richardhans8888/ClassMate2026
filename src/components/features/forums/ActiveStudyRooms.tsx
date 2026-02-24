"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mic,
  Clock,
  Calendar,
  Volume2,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const rooms = [
  {
    id: 1,
    title: "Advanced Calculus",
    category: "MATH",
    status: "Live",
    description:
      "Deep dive into differential equations and limits. Preparing for the mid-term.",
    participants: 24,
    speaking: 5,
    image: "from-blue-600 to-cyan-500", // Using gradients as placeholders
    tags: ["Calculus", "Exam Prep"],
  },
  {
    id: 2,
    title: "Python Data Science",
    category: "DEV",
    status: "Quiet",
    description:
      "Working through Pandas exercises. Screen sharing active for code review.",
    participants: 12,
    speaking: 0,
    image: "from-emerald-600 to-teal-500",
    tags: ["Python", "Pandas"],
  },
  {
    id: 3,
    title: "Modern Art History",
    category: "ART",
    status: "Live",
    description:
      "Discussing Bauhaus influence on modern web design. Bring your sketches.",
    participants: 8,
    speaking: 2,
    image: "from-orange-500 to-amber-500",
    tags: ["History", "Design"],
  },
  {
    id: 4,
    title: "Molecular Biology",
    category: "BIO",
    status: "Scheduled",
    description:
      "Study group for beginners. Introduction to cell structures and functions.",
    startTime: "Starts in 30m",
    image: "from-pink-600 to-rose-500",
    tags: ["Biology", "Cells"],
    participants: 0,
    speaking: 0,
  },
  {
    id: 5,
    title: "Quantum Mechanics 101",
    category: "PHY",
    status: "Live",
    description: "Discussing wave-particle duality and Schrödinger's equation.",
    participants: 15,
    speaking: 3,
    image: "from-indigo-600 to-purple-600",
    tags: ["Physics", "Quantum"],
  },
  {
    id: 6,
    title: "React.js Patterns",
    category: "DEV",
    status: "Quiet",
    description: "Code along session building a dashboard component.",
    participants: 42,
    speaking: 0,
    image: "from-cyan-600 to-blue-500",
    tags: ["React", "Frontend"],
  },
  {
    id: 7,
    title: "Linear Algebra Review",
    category: "MATH",
    status: "Scheduled",
    description: "Reviewing eigenvalues and eigenvectors before the final.",
    startTime: "Starts in 2h",
    participants: 0,
    speaking: 0,
    image: "from-blue-500 to-indigo-500",
    tags: ["Math", "Linear Algebra"],
  },
  {
    id: 8,
    title: "Typography Mastery",
    category: "ART",
    status: "Live",
    description: "Critique session for font pairing and hierarchy.",
    participants: 6,
    speaking: 4,
    image: "from-amber-500 to-orange-600",
    tags: ["Design", "Typography"],
  },
  {
    id: 9,
    title: "Genetics & DNA",
    category: "BIO",
    status: "Live",
    description: "Solving Punnett squares and discussing heredity.",
    participants: 18,
    speaking: 2,
    image: "from-rose-500 to-pink-600",
    tags: ["Biology", "Genetics"],
  },
  {
    id: 10,
    title: "Astrophysics Lounge",
    category: "PHY",
    status: "Quiet",
    description: "Silent study group for astronomy lovers.",
    participants: 9,
    speaking: 0,
    image: "from-violet-600 to-fuchsia-600",
    tags: ["Space", "Physics"],
  },
  {
    id: 11,
    title: "System Design Interview",
    category: "DEV",
    status: "Live",
    description: "Mock interviews for distributed systems.",
    participants: 30,
    speaking: 8,
    image: "from-slate-600 to-zinc-500",
    tags: ["Interview", "Backend"],
  },
  {
    id: 12,
    title: "Calculus III",
    category: "MATH",
    status: "Scheduled",
    description: "Multivariable calculus study group.",
    startTime: "Tomorrow, 10am",
    participants: 0,
    speaking: 0,
    image: "from-sky-500 to-blue-600",
    tags: ["Calculus", "Math"],
  },
];

const categories = [
  "All Rooms",
  "Mathematics",
  "Computer Science",
  "Design",
  "Biology",
  "Physics",
];

export function ActiveStudyRooms() {
  const [activeCategory, setActiveCategory] = useState("All Rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [joinOpen, setJoinOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filteredRooms = rooms.filter((room) => {
    // Filter by category
    const categoryMatch = (() => {
      if (activeCategory === "All Rooms") return true;
      if (activeCategory === "Mathematics") return room.category === "MATH";
      if (activeCategory === "Computer Science") return room.category === "DEV";
      if (activeCategory === "Design") return room.category === "ART";
      if (activeCategory === "Biology") return room.category === "BIO";
      if (activeCategory === "Physics") return room.category === "PHY";
      return false;
    })();

    // Filter by search query (ID or title)
    const searchMatch =
      searchQuery === "" ||
      room.id.toString().includes(searchQuery) ||
      room.title.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="mb-10">
      {/* Top Bar: Title, Search, Create */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Active Study Rooms{" "}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Collaborate in real-time with peers across the globe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Room ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <Button className="shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Create Room
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredRooms.map((room) => (
            <motion.div
              layout
              key={room.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-[#0F172A] rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 flex flex-col"
            >
              {/* Card Background Gradient/Image */}
              <div
                className={`h-32 bg-gradient-to-br ${room.image} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                    {room.category === "MATH" && "∑"}
                    {room.category === "DEV" && "<>"}
                    {room.category === "ART" && "🎨"}
                    {room.category === "BIO" && "🧬"}
                    {room.category === "PHY" && "⚛"}
                    {room.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0F172A] to-transparent pt-12">
                  {/* Avatars overlapping */}
                  <div className="flex -space-x-2 justify-end">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 z-10"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    {room.participants > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-gray-800 text-white flex items-center justify-center text-[10px] z-0">
                        +{room.participants - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-2 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-lg leading-tight group-hover:text-blue-400 transition-colors">
                    {room.title}
                  </h3>
                  {room.status === "Live" ? (
                    <span className="flex items-center gap-1 bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30 animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{" "}
                      Live
                    </span>
                  ) : room.status === "Quiet" ? (
                    <span className="flex items-center gap-1 bg-gray-700 text-gray-300 text-[10px] px-2 py-0.5 rounded-full border border-gray-600">
                      <Volume2 className="w-3 h-3" /> Quiet
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-gray-700 text-gray-300 text-[10px] px-2 py-0.5 rounded-full border border-gray-600">
                      <Clock className="w-3 h-3" /> Scheduled
                    </span>
                  )}
                </div>

                <p className="text-gray-400 text-xs mb-4 line-clamp-2 flex-1">
                  {room.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {room.status === "Scheduled" ? (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3 h-3" /> {room.startTime}
                      </span>
                    ) : (
                      <>
                        {room.speaking > 0 ? (
                          <span className="flex items-center gap-1 text-blue-400">
                            <Mic className="w-3 h-3" /> {room.speaking} speaking
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {room.participants}{" "}
                            members
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className={
                      room.status === "Scheduled"
                        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-8 text-xs"
                        : "bg-blue-600 hover:bg-blue-500 text-white h-8 text-xs shadow-lg shadow-blue-900/20"
                    }
                    onClick={() => {
                      if (room.status === "Scheduled") {
                        setToast(
                          "You will be reminded before this room starts.",
                        );
                        setTimeout(() => setToast(null), 2500);
                        return;
                      }
                      setSelectedRoom({ id: room.id, title: room.title });
                      setJoinOpen(true);
                    }}
                  >
                    {room.status === "Scheduled" ? "Remind Me" : "Join Room"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-black/80 text-white px-4 py-3 rounded-xl border border-white/10 shadow-xl">
          {toast}
        </div>
      )}

      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="bg-[#0F172A] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {selectedRoom ? `Join ${selectedRoom.title}` : "Join Room"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-sm text-gray-300">
            Join this study room.
          </div>
          <div className="grid grid-cols-1 gap-3 mt-4">
            <Link
              href={selectedRoom ? `/session/${selectedRoom.id}` : "#"}
              onClick={() => setJoinOpen(false)}
              className="block"
            >
              <div className="h-full p-4 rounded-xl border border-gray-700 hover:border-blue-500/50 bg-[#111827] hover:bg-[#0B1220] transition-colors">
                <div className="flex items-center gap-3 mb-1">
                  <Mic className="w-5 h-5 text-emerald-400" />
                  <div className="font-semibold">Join Voice</div>
                </div>
                <p className="text-xs text-gray-400">
                  Join the call. Chat and whiteboard available inside.
                </p>
              </div>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
