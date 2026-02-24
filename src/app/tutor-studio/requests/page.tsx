"use client";

import {
  Filter,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Calendar,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const requests = [
  {
    id: 1,
    name: "Alex Chen",
    course: "Advanced Physics",
    streak: "12 Day Streak",
    time: "2h ago",
    message:
      "Hi! I saw your reviews on quantum mechanics and really need help preparing for my finals next month. My goal is to get an A.",
    avatar: "Alex",
    highlight: true,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    course: "Calculus II",
    rank: "Top 10%",
    time: "5h ago",
    message:
      "Looking for a tutor who can explain integration by parts simply. I'm struggling with the concepts.",
    avatar: "Marcus",
    highlight: true,
  },
  {
    id: 3,
    name: "Sophia Miller",
    course: "Biology 101",
    time: "1d ago",
    avatar: "Sophia",
    highlight: false,
  },
];

const matches = [
  {
    name: "Sarah Jenkins",
    role: "SAT Math Prep",
    score: "Score 700+",
    rank: "Top 10%",
    goal: "Ace Finals",
    insight:
      "Sarah's visual learning style matches your teaching history perfectly.",
    match: 98,
    active: "10m ago",
    avatar: "Sarah",
  },
  {
    name: "David Kim",
    role: "Linear Algebra",
    sub: "Engineering",
    availability: "Evenings",
    urgency: "High",
    insight: 'Searching for "Linear Algebra experts" in your area.',
    match: 85,
    active: "1h ago",
    avatar: "David",
  },
  {
    name: "Emily Watson",
    role: "Chemistry",
    sub: "Pre-Med",
    active: "",
    avatar: "Emily",
    compact: true,
  },
];

export default function RequestsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Column: Requests */}
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Student Requests</h1>
            <p className="text-gray-400 text-sm">
              Manage incoming applications and messages.
            </p>
          </div>
          <button className="p-2 bg-[#1A1F26] rounded-lg hover:bg-[#252b36] transition-colors border border-gray-800">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`rounded-2xl border p-5 transition-all ${
                req.highlight
                  ? "bg-[#15181E] border-gray-800 hover:border-gray-700"
                  : "bg-[#15181E]/50 border-gray-800/50"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.avatar}`}
                        alt={req.name}
                        className="w-full h-full bg-[#2A303C]"
                      />
                    </div>
                    {req.highlight && (
                      <div className="absolute -bottom-1 -right-1 bg-[#15181E] rounded-full p-0.5">
                        <div className="bg-orange-500/20 p-1 rounded-full">
                          <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{req.name}</h3>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-medium">
                        {req.course}
                      </span>
                      {req.streak && (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {req.streak}
                        </span>
                      )}
                      {req.rank && (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                          {req.rank}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{req.time}</span>
              </div>

              {req.message && (
                <div className="bg-[#1A1F26] rounded-xl p-3 mb-5 relative">
                  <div className="absolute top-3 left-2 text-blue-500 text-xl leading-none font-serif">
                    "
                  </div>
                  <p className="text-sm text-gray-300 pl-4 relative z-10 leading-relaxed">
                    {req.message}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {req.highlight ? (
                  <>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-5 rounded-xl shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Accept Request
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-[#1A1F26] hover:bg-[#252b36] text-gray-300 border border-gray-700 py-5 px-5 rounded-xl"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Message
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-xl">
                      Accept
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-[#1A1F26] hover:bg-[#252b36] text-gray-300 border border-gray-700 py-2 px-4 rounded-xl"
                    >
                      Decline
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: AI Matches */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            AI Potential Matches
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {matches.map((match, i) => (
            <div
              key={i}
              className="bg-[#15181E] rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-colors"
            >
              {!match.compact ? (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-700 overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.avatar}`}
                          alt={match.name}
                          className="w-full h-full bg-[#FFD6A5]"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {match.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {match.role} •{" "}
                          <span className="text-gray-500">
                            {match.score || match.sub}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-blue-900/20">
                      <Sparkles className="w-3 h-3" />
                      {match.match}% MATCH
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#1A1F26] rounded-xl p-3 text-center border border-gray-800">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                        {match.rank ? "Current Rank" : "Availability"}
                      </p>
                      <p className="font-bold text-white">
                        {match.rank || match.availability}
                      </p>
                    </div>
                    <div className="bg-[#1A1F26] rounded-xl p-3 text-center border border-gray-800">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                        {match.goal ? "Goal" : "Urgency"}
                      </p>
                      <p
                        className={`font-bold ${match.urgency === "High" ? "text-orange-500" : "text-white"}`}
                      >
                        {match.goal || match.urgency}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex gap-3 items-start mb-5">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-200 leading-relaxed">
                      {match.insight}
                    </p>
                  </div>

                  {match.active && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <span className="text-xs text-gray-500">
                        Last active: {match.active}
                      </span>
                      <Button
                        variant="outline"
                        className="bg-[#1A1F26] border-gray-700 hover:bg-[#252b36] hover:text-white text-gray-300 h-9"
                      >
                        Connect <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-700 overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.avatar}`}
                        alt={match.name}
                        className="w-full h-full bg-[#E5E7EB]"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{match.name}</h3>
                      <p className="text-xs text-gray-400">
                        {match.role} • {match.sub}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-[#1A1F26] hover:bg-[#252b36] text-gray-300 border border-gray-700 h-9 px-4"
                  >
                    View
                  </Button>
                </div>
              )}
            </div>
          ))}

          <div className="bg-gradient-to-r from-[#15181E] to-[#1A1F26] rounded-2xl border border-gray-800 p-4 flex justify-between items-center">
            <span className="text-sm text-gray-400">
              Recently Viewed Your Profile
            </span>
            <Button
              variant="secondary"
              className="bg-[#252b36] hover:bg-[#2f3642] text-white border-0 h-8 text-xs"
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
