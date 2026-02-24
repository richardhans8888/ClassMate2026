"use client";

import {
  Search,
  Bell,
  MoreVertical,
  Video,
  Calendar,
  Plus,
  FileText,
  File,
  PlayCircle,
  Edit2,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

// Mock Data
const students = [
  {
    id: 1,
    name: "Sarah Jenkins",
    status: "Online",
    lastSeen: "Last seen 2m ago",
    progress: 85,
    avatar: "/avatars/sarah.jpg",
    needsAttention: false,
  },
  {
    id: 2,
    name: "Michael Chen",
    status: "Offline",
    lastSeen: "Needs Attention",
    progress: 42,
    avatar: "/avatars/michael.jpg",
    needsAttention: true,
  },
  {
    id: 3,
    name: "David Kim",
    status: "Offline",
    lastSeen: "2h ago",
    progress: 78,
    avatar: "/avatars/david.jpg",
    needsAttention: false,
  },
  {
    id: 4,
    name: "Emily Davis",
    status: "Online",
    lastSeen: "Online",
    progress: 92,
    avatar: "/avatars/emily.jpg",
    needsAttention: false,
  },
  {
    id: 5,
    name: "Mark Wilson",
    status: "Offline",
    lastSeen: "5h ago",
    progress: 65,
    avatar: "/avatars/mark.jpg",
    needsAttention: false,
  },
];

const modules = [
  {
    id: 1,
    title: "Lecture Notes: Derivatives",
    type: "pdf",
    status: "Published",
    uploaded: "Uploaded yesterday",
    views: 45,
  },
  {
    id: 2,
    title: "Research: Intro to Quantum Mechanics",
    type: "doc",
    status: "Draft",
    uploaded: "Draft saved 2h ago",
    views: 0,
  },
  {
    id: 3,
    title: "Video: Practical Application",
    type: "video",
    status: "Published",
    uploaded: "24 views",
    views: 24,
  },
];

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center bg-[#15181E] p-6 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">
              Advanced Calculus - Fall Cohort
            </h1>
            <span className="bg-teal-500/20 text-teal-400 text-xs font-bold px-2 py-1 rounded-full animate-pulse border border-teal-500/30">
              Live Now
            </span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Next Session: Today, 2:00 PM
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search students, notes..."
              className="w-full bg-[#0F1115] border border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
          <button className="relative p-2 rounded-full hover:bg-[#252b36] transition-colors text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#15181E]"></div>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics & Quick Actions Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engagement Analytics */}
            <div className="bg-[#15181E] p-6 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-white">Engagement Analytics</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Student activity over the last 7 days
                  </p>
                </div>
                <span className="bg-teal-500/10 text-teal-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +12%
                </span>
              </div>

              {/* Mock Bar Chart */}
              <div className="flex items-end justify-between h-32 gap-2 mt-4">
                {[40, 65, 45, 80, 60, 25, 15].map((height, i) => (
                  <div
                    key={i}
                    className="w-full bg-[#1A1F26] rounded-t-sm relative group"
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-blue-600/80 hover:bg-blue-500 transition-all rounded-t-sm"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#15181E] p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-blue-900/20">
                    <Video className="w-8 h-8" />
                    Start Live Session
                  </button>
                  <button className="w-full bg-[#1A1F26] hover:bg-[#252b36] text-gray-300 hover:text-white p-4 rounded-xl flex items-center justify-center gap-3 transition-all font-medium border border-gray-800">
                    <Calendar className="w-5 h-5" />
                    Schedule Workshop
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-[#15181E] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-lg">Course Content</h3>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Module
              </Button>
            </div>

            <div className="p-2">
              <div className="grid grid-cols-12 text-xs font-bold text-gray-500 uppercase px-4 py-2">
                <div className="col-span-6">Module Name</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              <div className="space-y-1">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="grid grid-cols-12 items-center px-4 py-3 hover:bg-[#1A1F26] rounded-lg transition-colors group"
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          module.type === "pdf"
                            ? "bg-red-500/10 text-red-400"
                            : module.type === "doc"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-purple-500/10 text-purple-400"
                        }`}
                      >
                        {module.type === "pdf" && (
                          <FileText className="w-5 h-5" />
                        )}
                        {module.type === "doc" && <File className="w-5 h-5" />}
                        {module.type === "video" && (
                          <PlayCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {module.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {module.uploaded}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full border ${
                          module.status === "Published"
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {module.status}
                      </span>
                    </div>

                    <div className="col-span-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* End Course Section (Requested Feature) */}
          <div className="flex justify-end pt-4 border-t border-gray-800">
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/10"
            >
              End Course & Archive
            </Button>
          </div>
        </div>

        {/* Right Column (Student Roster) */}
        <div className="bg-[#15181E] rounded-2xl border border-gray-800 flex flex-col h-full">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-lg">Student Roster</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              24 Students
              <Filter className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[600px]">
            {students.map((student) => (
              <div key={student.id} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300 overflow-hidden">
                      {/* Placeholder Avatar */}
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#15181E] ${
                        student.status === "Online"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-white text-sm">
                        {student.name}
                      </div>
                      <div className="text-xs font-bold text-white">
                        {student.progress}%
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      {student.needsAttention ? (
                        <span className="text-red-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3" /> Needs Attention
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {student.status === "Online" ? "Online" : "Offline"} •{" "}
                          {student.lastSeen}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-[#1A1F26] rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full ${
                      student.needsAttention ? "bg-red-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-800 mt-auto">
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-[#1A1F26] hover:text-white"
            >
              View Full Roster
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
