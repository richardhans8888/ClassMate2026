"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Calendar,
  Users,
  Award,
  Share2,
  Heart,
  Play,
  ChevronRight,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function TutorProfilePage() {
  const [activeDate, setActiveDate] = useState(2);
  const [activeTime, setActiveTime] = useState("02:30 PM");

  // Mock Data matching the design image
  const tutor = {
    name: "Dr. Sarah Jenkins",
    title: "Ph.D. in Astrophysics, Stanford University",
    verified: true,
    tags: ["Physics", "Calculus", "Quantum Mechanics", "SAT Prep"],
    stats: {
      students: "1,200+",
      rating: "4.9/5.0",
      successRate: "98%",
      experience: "10+ Yrs",
    },
    rate: 150,
    about: `Specializing in advanced physics and mathematics, I help students bridge the gap between theory and application. With over 10 years of research and teaching experience at top universities, my goal is to make complex concepts accessible and engaging.

I believe in a personalized approach, tailoring each session to the student's learning style. Whether you're preparing for AP exams, tackling college-level calculus, or just curious about the cosmos, I'm here to guide you.`,
    reviews: [
      {
        id: 1,
        name: "Michael T.",
        course: "Calculus II Student",
        rating: 5,
        text: "Dr. Jenkins explains concepts in a way that just clicks. I went from failing to getting an A in my midterms!",
        avatar: "MT",
        color: "bg-rose-500",
      },
      {
        id: 2,
        name: "Jessica L.",
        course: "Quantum Physics",
        rating: 5,
        text: "Incredibly patient and knowledgeable. She uses great visual aids that help with the abstract topics.",
        avatar: "JL",
        color: "bg-blue-400",
      },
    ],
    courses: [
      { name: "Advanced Calculus II", modules: 12, level: "Intermediate" },
      { name: "Quantum Mechanics Basics", modules: 8, level: "Advanced" },
      { name: "SAT Math Prep", modules: 20, level: "Beginner" },
    ],
  };

  const dates = [
    { day: "S", date: 29 },
    { day: "M", date: 30 },
    { day: "T", date: 1 },
    { day: "W", date: 2 },
    { day: "T", date: 3 },
    { day: "F", date: 4 },
    { day: "S", date: 5 },
  ];

  const timeSlots = ["09:00 AM", "02:30 PM", "04:00 PM"];

  return (
    <div className="min-h-screen bg-[#0F1115] text-gray-200 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/tutors" className="inline-block mb-6">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-gray-800 -ml-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tutors
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card */}
            <div className="bg-[#151921] rounded-3xl p-8 border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                {/* Profile Image */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop"
                        alt="Dr. Sarah Jenkins"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-[#151921] rounded-full" />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {tutor.name}
                      </h1>
                      <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20 mb-3">
                        <Award className="w-3 h-3" />
                        VERIFIED TUTOR
                      </div>
                      <p className="text-gray-400 text-lg font-medium">
                        {tutor.title}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {tutor.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#1E2330] text-gray-300 text-sm font-medium px-4 py-1.5 rounded-full border border-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#151921] rounded-2xl p-6 border border-gray-800 text-center hover:border-blue-500/30 transition-colors group">
                <Users className="w-6 h-6 mx-auto mb-3 text-blue-500 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white mb-1">
                  {tutor.stats.students}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                  Students Taught
                </div>
              </div>
              <div className="bg-[#151921] rounded-2xl p-6 border border-gray-800 text-center hover:border-yellow-500/30 transition-colors group">
                <Star className="w-6 h-6 mx-auto mb-3 text-yellow-500 fill-yellow-500 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white mb-1">
                  {tutor.stats.rating}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                  Average Rating
                </div>
              </div>
              <div className="bg-[#151921] rounded-2xl p-6 border border-gray-800 text-center hover:border-emerald-500/30 transition-colors group">
                <TrendingUp className="w-6 h-6 mx-auto mb-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white mb-1">
                  {tutor.stats.successRate}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                  Success Rate
                </div>
              </div>
              <div className="bg-[#151921] rounded-2xl p-6 border border-gray-800 text-center hover:border-purple-500/30 transition-colors group">
                <Award className="w-6 h-6 mx-auto mb-3 text-purple-500 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white mb-1">
                  {tutor.stats.experience}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                  Experience
                </div>
              </div>
            </div>

            {/* About Me */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl font-bold text-white">About Me</h2>
              </div>
              <div className="bg-[#151921] rounded-3xl p-8 border border-gray-800">
                <p className="text-gray-400 leading-relaxed whitespace-pre-line text-lg">
                  {tutor.about}
                </p>
              </div>
            </div>

            {/* Student Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl font-bold text-white">
                  Student Reviews
                </h2>
              </div>
              <div className="grid gap-6">
                {tutor.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#151921] rounded-3xl p-8 border border-gray-800 flex gap-6 hover:bg-[#1A202C] transition-colors"
                  >
                    <div
                      className={`w-14 h-14 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-xl shrink-0`}
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-white text-lg">
                            {review.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {review.course}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-700"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 italic text-lg">
                        "{review.text}"
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full py-6 rounded-2xl border-gray-800 text-gray-400 hover:text-white hover:bg-[#1A202C] hover:border-gray-700"
                >
                  View All 342 Reviews
                </Button>
              </div>
            </div>

            {/* Teaching Philosophy (Video) */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl font-bold text-white">
                  Teaching Philosophy
                </h2>
              </div>
              <div className="bg-[#151921] rounded-3xl overflow-hidden border border-gray-800 aspect-video relative group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2873&auto=format&fit=crop"
                  alt="Teaching Philosophy"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Booking Card */}
            <div className="bg-[#151921] rounded-3xl p-6 border border-gray-800 sticky top-24">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-sm text-gray-500 font-medium block mb-1">
                    Hourly Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      ${tutor.rate}
                    </span>
                    <span className="text-gray-500">/hr</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Available Now
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 rounded-2xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book 1:1 Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 font-bold py-6 rounded-2xl transition-all"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Request Group Session
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                <Zap className="w-3 h-3 text-gray-400" />
                Powered by AI Scheduling
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="bg-[#151921] rounded-3xl p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white">Availability</h3>
                <span className="text-xs text-gray-500 font-medium">
                  Oct 2023
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-8 text-center">
                {dates.map((d, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-[10px] text-gray-500 font-medium uppercase">
                      {d.day}
                    </div>
                    <button
                      onClick={() => setActiveDate(d.date)}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        activeDate === d.date
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40 scale-110"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {d.date}
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <span className="text-xs text-gray-500 font-medium block mb-2">
                  Available slots on Oct {activeDate}nd:
                </span>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setActiveTime(time)}
                      className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                        activeTime === time
                          ? "bg-blue-600/20 text-blue-400 border-blue-500/50"
                          : "bg-[#1E2330] text-gray-400 border-gray-800 hover:border-gray-600 hover:text-gray-300"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Offerings */}
            <div className="bg-[#151921] rounded-3xl p-6 border border-gray-800">
              <h3 className="font-bold text-white mb-6">Course Offerings</h3>
              <div className="space-y-3">
                {tutor.courses.map((course, idx) => (
                  <Link
                    href={`/modules/${course.name.toLowerCase().replace(/ /g, "-")}`}
                    key={idx}
                    className="group flex items-center justify-between bg-[#1E2330] hover:bg-[#252b3b] p-4 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-all cursor-pointer"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">
                        {course.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {course.modules} Modules • {course.level}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
