"use client";

import { Button } from "@/components/ui/Button";
import {
  User,
  Settings,
  Share2,
  Flame,
  Star,
  Trophy,
  MapPin,
  GraduationCap,
  Zap,
  Calculator,
  Moon,
  ThumbsUp,
  Bug,
  CheckCircle2,
  Users,
  ArrowUp,
  MessageSquare,
  BookOpen,
  ChevronRight,
  PenTool,
  Award,
  History,
} from "lucide-react";
import { motion } from "framer-motion";

const user = {
  name: "Alex Rivera",
  role: "Computer Science Major",
  location: "MIT, Class of 2026",
  level: 12,
  tags: ["Machine Learning", "Web Dev", "Data Structures"],
  stats: {
    streak: 42,
    xp: 12450,
    rank: "Top 5%",
    rankNum: "#142 Overall",
  },
  badges: [
    {
      name: "Calculus Pro",
      desc: "Solved 50+ complex integration problems with >90% accuracy.",
      icon: Calculator,
      color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10",
      earned: "Earned 2 days ago",
    },
    {
      name: "Night Owl",
      desc: "Logged 20 hours of study time between 12 AM and 4 AM.",
      icon: Moon,
      color:
        "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-400/10",
      earned: "Earned 1 week ago",
    },
    {
      name: "Top Contributor",
      desc: "Received 100+ helpful upvotes on community answers.",
      icon: ThumbsUp,
      color:
        "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10",
      earned: "Earned 2 weeks ago",
    },
    {
      name: "Bug Hunter",
      desc: "Successfully identified and reported 5 platform bugs.",
      icon: Bug,
      color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10",
      earned: "Earned 1 month ago",
    },
  ],
  courses: [
    {
      id: "CS 201",
      name: "Intro to Algorithms",
      nextTask: "Dynamic Programming Quiz",
      progress: 85,
      color: "bg-blue-600",
    },
    {
      id: "WEB 300",
      name: "Web Development II",
      nextTask: "React Hooks Assignment",
      progress: 40,
      color: "bg-purple-600",
    },
  ],
  activity: [
    {
      type: "assignment",
      title: "Submitted Assignment: Linear Algebra",
      meta: "Scored 98/100 • 2 hours ago",
      icon: CheckCircle2,
      color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10",
    },
    {
      type: "group",
      title: "Joined Group: Hackathon Prep",
      meta: "The group has 12 active members • 5 hours ago",
      icon: Users,
      color:
        "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-400/10",
    },
    {
      type: "upvote",
      title: "Upvoted 5 solutions",
      meta: 'In "Advanced Python" community • Yesterday',
      icon: ArrowUp,
      color:
        "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10",
    },
    {
      type: "reply",
      title: "Replied to Physics Thread",
      meta: '"The velocity vector should be..." • Yesterday',
      icon: MessageSquare,
      color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10",
    },
  ],
  groups: [
    {
      name: "CS101 Study Buddy",
      online: 3,
      initial: "CS",
      color: "bg-indigo-600",
    },
    {
      name: "Late Night Coders",
      online: 12,
      initial: "LN",
      color: "bg-slate-700",
    },
  ],
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05050A] text-gray-900 dark:text-gray-200 p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-[#0F1117] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-800/50 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20">
            <GraduationCap className="w-32 h-32 text-gray-400 dark:text-gray-500" />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="w-full h-full rounded-full bg-white dark:bg-[#15171E] p-1">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                    alt="Alex Rivera"
                    className="w-full h-full rounded-full bg-[#FFD6A5]"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1E2028] px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 flex items-center gap-1 shadow-xl">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lvl
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {user.level}
                </span>
                <Zap className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    {user.role}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#1E2028] border border-gray-200 dark:border-gray-700/50 text-xs text-gray-700 dark:text-gray-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6">
                  <PenTool className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-[#1E2028]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>

            {/* Institution Logo (Visual Only) */}
            <div className="hidden md:flex flex-col items-center text-gray-400 dark:text-gray-500 opacity-60">
              <div className="border-2 border-current rounded-sm p-1 mb-1">
                <div className="w-8 h-4 border-t-2 border-current"></div>
                <div className="flex justify-between mt-1 px-0.5">
                  <div className="w-1 h-3 bg-current"></div>
                  <div className="w-1 h-3 bg-current"></div>
                  <div className="w-1 h-3 bg-current"></div>
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Massachusetts Inst.
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white dark:bg-[#0F1117] p-6 rounded-2xl border border-gray-200 dark:border-gray-800/50 flex items-center justify-between group hover:border-orange-500/30 dark:hover:border-orange-900/30 transition-colors shadow-sm">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Study Streak
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.stats.streak} Days
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-500">
                  ↑ +2
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-500/20 transition-colors">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F1117] p-6 rounded-2xl border border-gray-200 dark:border-gray-800/50 flex items-center justify-between group hover:border-blue-500/30 dark:hover:border-purple-900/30 transition-colors relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Academic XP
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.stats.xp.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">pts</span>
              </div>
              <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[70%]"></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors relative z-10">
              <Star className="w-6 h-6 text-blue-500 fill-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F1117] p-6 rounded-2xl border border-gray-200 dark:border-gray-800/50 flex items-center justify-between group hover:border-green-500/30 dark:hover:border-green-900/30 transition-colors shadow-sm">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Global Rank
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.stats.rank}
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-500">
                  {user.stats.rankNum}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-500/20 transition-colors">
              <Trophy className="w-6 h-6 text-green-600 dark:text-green-500 fill-green-600 dark:fill-green-500" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skill Badges */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                  Skill Badges
                </h2>
                <button className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.badges.map((badge, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#0F1117] p-5 rounded-2xl border border-gray-200 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 transition-colors flex gap-4 shadow-sm"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${badge.color}`}
                    >
                      <badge.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-200 text-sm">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {badge.desc}
                      </p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-medium">
                        {badge.earned}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrolled Courses */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                Enrolled Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-[#0F1117] p-5 rounded-2xl border border-gray-200 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold bg-gray-100 dark:bg-[#1E2028] text-blue-600 dark:text-blue-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-700/50">
                        {course.id}
                      </span>
                      <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        •••
                      </button>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {course.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Next: {course.nextTask}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${course.color} rounded-full`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-white">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                Recent Activity
              </h2>
              <div className="bg-white dark:bg-[#0F1117] p-5 rounded-3xl border border-gray-200 dark:border-gray-800/50 shadow-sm">
                <div className="relative pl-2">
                  {/* Timeline Line */}
                  <div className="absolute top-2 bottom-4 left-[15px] w-px bg-gray-100 dark:bg-gray-800"></div>

                  <div className="space-y-6">
                    {user.activity.map((act, i) => (
                      <div key={i} className="relative flex gap-4 group">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-[#0F1117] z-10 ${act.color}`}
                        >
                          <act.icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="pt-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {act.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {act.meta}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Study Groups */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Active Study Groups
              </h2>
              <div className="bg-white dark:bg-[#0F1117] rounded-3xl border border-gray-200 dark:border-gray-800/50 overflow-hidden shadow-sm">
                {user.groups.map((group, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#1E2028] transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${group.color}`}
                    >
                      {group.initial}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200">
                        {group.name}
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        {group.online} members online now
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
