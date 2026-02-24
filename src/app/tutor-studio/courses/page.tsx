"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, BookOpen, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const activeCourses = [
  {
    id: "advanced-calculus",
    title: "Advanced Calculus - Fall Cohort",
    students: 24,
    nextSession: "Today, 2:00 PM",
    progress: 75,
    status: "Live Now",
    color: "bg-teal-500",
  },
  {
    id: "physics-101",
    title: "Physics 101 - Introduction",
    students: 18,
    nextSession: "Tomorrow, 10:00 AM",
    progress: 45,
    status: "Active",
    color: "bg-purple-500",
  },
  {
    id: "chemistry-lab",
    title: "Organic Chemistry Lab",
    students: 12,
    nextSession: "Friday, 1:00 PM",
    progress: 30,
    status: "Active",
    color: "bg-blue-500",
  },
];

export default function CoursesPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Active Courses</h1>
          <p className="text-gray-400 text-sm">
            Manage your ongoing classes and cohorts.
          </p>
        </div>
        <Button
          className="bg-teal-500 hover:bg-teal-600 text-black font-bold"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCourses.map((course) => (
          <Link
            href={`/tutor-studio/courses/${course.id}`}
            key={course.id}
            className="group block bg-[#15181E] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all hover:bg-[#1A1F26]"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl ${course.color}/10 text-${course.color.replace("bg-", "")}`}
              >
                <BookOpen
                  className={`w-6 h-6 ${course.color.replace("bg-", "text-")}`}
                />
              </div>
              {course.status === "Live Now" && (
                <span className="bg-teal-500/20 text-teal-400 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  LIVE NOW
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold mb-2 group-hover:text-teal-400 transition-colors">
              {course.title}
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                {course.students} Students
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                {course.nextSession}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Course Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${course.color}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
              Manage Course{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}

        {/* Add New Course Placeholder Card */}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center justify-center h-full min-h-[250px] rounded-2xl border-2 border-dashed border-gray-800 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-teal-500/20 flex items-center justify-center mb-4 transition-colors">
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-teal-400" />
          </div>
          <span className="font-medium text-gray-400 group-hover:text-teal-400">
            Add New Course
          </span>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0F1117] border-gray-800">
          <DialogHeader>
            <DialogTitle>Propose a New Course</DialogTitle>
            <DialogDescription>
              Fill out the details and submit for review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs text-gray-400">Course Title</label>
              <input
                className="w-full mt-1 bg-[#15181E] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                placeholder="e.g., Data Structures"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400">Category</label>
                <input
                  className="w-full mt-1 bg-[#15181E] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Level</label>
                <select className="w-full mt-1 bg-[#15181E] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400">Description</label>
              <textarea
                className="w-full mt-1 bg-[#15181E] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                rows={4}
                placeholder="Briefly describe course outcomes, structure and requirements."
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Propose</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
