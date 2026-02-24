"use client";

import {
  Search,
  Bell,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  MoreVertical,
  Plus,
  Flame,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TutorStudioPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search courses, students..."
              className="w-full bg-[#1A1F26] border border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
          <button className="relative p-2 rounded-full hover:bg-[#1A1F26] transition-colors text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full border-2 border-[#0F1115]"></div>
          </button>
        </div>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Assistant Card */}
        <div className="lg:col-span-1 bg-[#15181E] rounded-2xl p-6 border border-gray-800/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                AI Assistant
              </div>
              <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/30">
                New Insight
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">Physics Syllabus Update</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Trending research in Quantum Mechanics suggests adding a module on
              "Entanglement Basics". 85% of similar premium courses have updated
              their curriculum this week.
            </p>
            <button className="text-sm font-medium text-white flex items-center gap-2 group-hover:gap-3 transition-all">
              Review Suggested Material <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-[#15181E] rounded-2xl p-6 border border-gray-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-1 rounded">
              +12% vs last month
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Total Earnings</p>
            <h3 className="text-3xl font-bold">$4,250.00</h3>
          </div>
        </div>

        {/* Students Card */}
        <div className="bg-[#15181E] rounded-2xl p-6 border border-gray-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Active Now
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Total Students</p>
            <h3 className="text-3xl font-bold">128</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Student Requests */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Pending Student Requests</h2>
              <button className="text-sm text-teal-400 hover:text-teal-300">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  name: "Sarah Jenkins",
                  course: "Advanced Calculus & Linear Algebra",
                  time: "Submitted 2 hours ago",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                  new: true,
                },
                {
                  name: "Marcus Chen",
                  course: "Introduction to Python Programming",
                  time: "Submitted 5 hours ago",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
                  new: false,
                },
              ].map((req, i) => (
                <div
                  key={i}
                  className="bg-[#15181E] p-4 rounded-xl border border-gray-800/50 flex items-center justify-between group hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={req.img}
                        alt={req.name}
                        className="w-12 h-12 rounded-full bg-gray-700"
                      />
                      {req.new && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-[#15181E] rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white">{req.name}</h4>
                        {req.new && (
                          <span className="text-[10px] font-bold bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        Requesting:{" "}
                        <span className="text-gray-300">{req.course}</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{req.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 border border-gray-700"
                    >
                      Decline
                    </Button>
                    <Button className="bg-teal-500 hover:bg-teal-600 text-black font-bold">
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Courses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">My Active Courses</h2>
              <button className="text-gray-400 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-500 hover:border-teal-500/50 hover:bg-teal-500/5 hover:text-teal-500 transition-all cursor-pointer group h-full min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-[#1A1F26] flex items-center justify-center mb-3 group-hover:bg-teal-500/20 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-medium">Create New Course</span>
              </div>

              <div className="bg-[#15181E] rounded-2xl p-5 border border-gray-800/50 relative overflow-hidden group hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 px-2 py-1 rounded uppercase">
                    Math
                  </span>
                  <button className="text-gray-500 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-lg mb-1">Advanced Calculus</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Mon, Wed • 10:00 AM
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-bold text-white">75%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-3/4 rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center -space-x-2 mt-4 pt-4 border-t border-gray-800/50">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-[#15181E] bg-gray-700 overflow-hidden"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-[#15181E] bg-[#1A1F26] flex items-center justify-center text-[8px] font-bold text-gray-400">
                    +12
                  </div>
                </div>
              </div>

              <div className="bg-[#15181E] rounded-2xl p-5 border border-gray-800/50 relative overflow-hidden group hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold bg-teal-500/20 text-teal-400 px-2 py-1 rounded uppercase">
                    Science
                  </span>
                  <button className="text-gray-500 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-lg mb-1">Physics 101</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Tue, Thu • 02:00 PM
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-bold text-white">45%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-[45%] rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center -space-x-2 mt-4 pt-4 border-t border-gray-800/50">
                  {[4].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-[#15181E] bg-gray-700 overflow-hidden"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-[#15181E] bg-[#1A1F26] flex items-center justify-center text-[8px] font-bold text-gray-400">
                    +8
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) - Progress Tracker */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold mb-4">Student Progress Tracker</h2>
          <div className="bg-[#15181E] rounded-2xl border border-gray-800/50 p-4">
            <div className="grid grid-cols-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
              <span>Student</span>
              <span className="text-center">Streak</span>
              <span className="text-right">Next Session</span>
            </div>
            <div className="space-y-1">
              {[
                {
                  name: "Emma W.",
                  subject: "Calculus",
                  streak: 12,
                  time: "Tomorrow",
                  subTime: "10:00 AM",
                  img: "Emma",
                },
                {
                  name: "James L.",
                  subject: "Physics",
                  streak: 0,
                  time: "Today",
                  subTime: "4:30 PM",
                  active: true,
                  img: "James",
                },
                {
                  name: "Sophie R.",
                  subject: "Chemistry",
                  streak: 5,
                  time: "Sep 24",
                  subTime: "11:00 AM",
                  img: "Sophie",
                },
                {
                  name: "Michael T.",
                  subject: "Geometry",
                  streak: 8,
                  time: "Sep 25",
                  subTime: "09:00 AM",
                  img: "Michael",
                },
              ].map((student, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 items-center p-2 rounded-xl hover:bg-[#1A1F26] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.img}`}
                        alt={student.name}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">
                        {student.name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {student.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div
                      className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${student.streak > 0 ? "bg-orange-500/10 text-orange-500" : "bg-gray-800 text-gray-500"}`}
                    >
                      <Flame
                        className={`w-3 h-3 ${student.streak > 0 ? "fill-orange-500" : ""}`}
                      />
                      {student.streak}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-bold ${student.active ? "text-teal-400" : "text-gray-300"}`}
                    >
                      {student.time}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {student.subTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-[#1A1F26] hover:bg-[#20252E] text-xs font-bold text-gray-300 py-3 rounded-xl transition-colors uppercase tracking-wide">
              View All Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
