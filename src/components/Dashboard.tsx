
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, MessageSquare, TrendingUp, BookOpen, Star, Flame, Trophy, User, Search, Play, Filter, Check, ChevronDown, ChevronLeft, ChevronRight, Bot, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data
const featuredTutors = [
  {
    id: 1,
    name: "Sarah Jenkins",
    rating: 4.9,
    reviews: 120,
    subtitle: "MS in Data Science",
    tags: ["Python", "Statistics", "AI Tools"],
    description: "I help students bridge the gap between theory and code...",
    badge: "100+ Hours Taught",
    rate: 35,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 2,
    name: "Marcus Chen",
    rating: 4.7,
    reviews: 45,
    subtitle: "PhD Candidate, Physics",
    tags: ["Calculus III", "Physics 101"],
    description: "Focusing on mechanics and thermodynamics. I use real-world...",
    badge: "Level 8 Mentor",
    rate: 45,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    rating: 4.8,
    reviews: 60,
    subtitle: "BFA in Creative Writing",
    tags: ["Essay Writing", "Literature"],
    description: "Struggling with your thesis? I help structure arguments and refine...",
    badge: "New Talent",
    rate: 28,
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: 4,
    name: "David Kim",
    rating: 4.8,
    reviews: 210,
    subtitle: "Senior Software Engineer",
    tags: ["Algorithms", "Java", "System Design"],
    description: "Preparing for technical interviews? I offer mock interviews and code...",
    badge: "Top 1% Mentor",
    rate: 80,
    color: "from-emerald-500 to-teal-500"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-6 md:px-12 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Find Your Perfect Academic Mentor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl">
              Connect with verified experts and AI-enhanced tutors for 1-on-1 sessions or join collaborative group workshops.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-3xl mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="w-full bg-gray-100 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-full py-4 pl-12 pr-40 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition-all shadow-sm hover:shadow-md"
              placeholder="Search by subject, semester material (e.g., 'Calculus II', 'Bio 101'), or tutor name"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95">
                Advanced Filters
              </button>
            </div>
          </motion.div>

          {/* Featured & Trending Header */}
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Flame className="text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400 h-6 w-6 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold">Featured & Trending</h2>
            </div>
            <Link href="/tutors" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center gap-1 group">
              View all 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Featured Cards Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Workshop Card */}
            <motion.div variants={item} className="relative rounded-2xl overflow-hidden group cursor-pointer h-64 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
              
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-lg" />

              <div className="absolute top-4 left-4">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">Workshop</span>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20 group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white fill-white" />
                 </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-xl font-bold mb-1 leading-tight text-white">Mastering Linear Algebra with AI</h3>
                <div className="flex justify-between items-end">
                  <p className="text-gray-200 text-sm flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    Starts in 2 hours
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Featured Tutor Card */}
            <motion.div variants={item} className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-md hover:shadow-lg hover:-translate-y-1 relative cursor-pointer group">
               <div className="absolute top-5 right-5 flex flex-col items-end gap-1">
                  <div className="bg-gray-100 dark:bg-[#0F172A] px-2 py-1 rounded-md flex items-center gap-1 border border-gray-200 dark:border-gray-700">
                     <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                     <span className="text-xs font-bold text-gray-900 dark:text-white">5.0</span>
                  </div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-300 font-medium">Top Rated</span>
               </div>
               
               <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    AG
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Dr. Alan Grant 
                        <span className="bg-blue-500 rounded-full p-[2px]"><Check className="h-2 w-2 text-white" /></span>
                     </h3>
                     <p className="text-blue-600 dark:text-blue-400 text-sm">Paleontology & Biology</p>
                  </div>
               </div>

               <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-gray-100 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1 rounded-md">Genetics</span>
                  <span className="bg-gray-100 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1 rounded-md">Evolutionary Bio</span>
               </div>

               <p className="text-gray-600 dark:text-gray-400 text-xs mb-4 line-clamp-2">Specializing in complex biological systems. I use 3D modeling tools to explain structures.</p>

               <div className="flex items-center justify-between mt-auto">
                  <span className="text-gray-900 dark:text-white font-bold text-lg">$60<span className="text-gray-500 text-sm font-normal">/hr</span></span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow hover:shadow-md active:scale-95">Book Session</button>
               </div>
            </motion.div>

            {/* AI Promo Card */}
            <motion.div variants={item} className="bg-gradient-to-br from-[#1E1B4B] to-[#1E293B] rounded-2xl p-6 border border-indigo-900/50 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-lg hover:shadow-indigo-500/20 transition-all hover:-translate-y-1">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
               
               <div className="bg-indigo-500/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-500 animate-bounce-slow">
                  <Bot className="h-8 w-8 text-indigo-400" />
               </div>
               
               <h3 className="text-xl font-bold text-white mb-2">Try AI Tutoring</h3>
               <p className="text-gray-400 text-sm mb-6 max-w-xs">Get instant help with homework, concept explanations, and quiz generation 24/7.</p>
               
               <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-6 py-2.5 rounded-full shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                  Start Free Chat
               </button>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Filters */}
        <aside className="lg:col-span-1 space-y-8 sticky top-24 self-start">
          
          {/* Tutor Type */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
               <Filter className="w-3 h-3" /> Filters
            </h3>
            <div className="bg-gray-50 dark:bg-[#1E293B] p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
               <h4 className="font-semibold text-sm">Tutor Type</h4>
               <label className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Human Expert</span>
                  <input type="checkbox" defaultChecked className="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-0" />
               </label>
               <label className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">AI Enhanced</span>
                  <input type="checkbox" className="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-0" />
               </label>
            </div>
          </motion.div>

          {/* Subject */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Subject</h3>
            <div className="space-y-1">
              {[
                { name: "Computer Science", count: 134, active: true },
                { name: "Mathematics", count: 85, active: false },
                { name: "Physics", count: 63, active: false },
                { name: "Literature", count: 30, active: false }
              ].map((subject) => (
                <Link 
                  href={`/subjects/${subject.name.toLowerCase().replace(' ', '-')}`} 
                  key={subject.name} 
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${subject.active ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                  <span className="text-sm font-medium">{subject.name}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${subject.active ? 'bg-white text-blue-600' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>{subject.count}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {["Today", "This Week", "Weekends"].map(opt => (
                <button key={opt} className="bg-white dark:bg-[#1E293B] hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Right Content - Results */}
        <div className="lg:col-span-3">
          
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <span className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500 p-1 rounded-full"><Check className="h-3 w-3" /></span>
              Showing <span className="text-gray-900 dark:text-white font-bold">24</span> verified tutors
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Sort by:</span>
              <button className="flex items-center gap-1 text-gray-900 dark:text-white text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Recommended <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tutors Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {featuredTutors.map((tutor) => (
              <motion.div 
                key={tutor.id} 
                variants={item}
                className="bg-white dark:bg-[#1E293B] rounded-xl p-5 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-lg group relative cursor-pointer"
              >
                {tutor.name === "Elena Rodriguez" && (
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-full shadow-lg z-10 cursor-pointer hover:bg-blue-700 transition-colors animate-bounce">
                    <MessageSquare className="h-5 w-5 text-white" />
                    <div className="absolute top-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white dark:border-[#0F172A]"></div>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${tutor.color} flex items-center justify-center text-white font-bold shadow-md`}>
                       {tutor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tutor.name}
                        {tutor.id <= 2 && <span className="h-2 w-2 rounded-full bg-green-500 inline-block ml-1 ring-2 ring-white dark:ring-[#1E293B]"></span>}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{tutor.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-yellow-500 text-sm font-bold">
                      <Star className="h-4 w-4 fill-yellow-500" />
                      {tutor.rating}
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-[10px]">{tutor.reviews} reviews</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {tutor.tags.map(tag => (
                    <span key={tag} className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${tag === 'AI Tools' ? 'bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400' : 'bg-gray-50 dark:bg-[#0F172A] border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300'}`}>
                      {tag === 'AI Tools' && <span className="inline-block mr-1">✨</span>}
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-xs mb-4 line-clamp-2 h-8">{tutor.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                    {tutor.badge.includes("Hours") ? <Flame className="h-3 w-3 text-orange-500" /> : <Trophy className="h-3 w-3 text-yellow-500" />}
                    {tutor.badge}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <div>
                    <p className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold tracking-wider">Rate</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">${tutor.rate}<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">/hr</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                      <User className="h-5 w-5" />
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95">
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button className="h-8 w-8 rounded-full bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-full bg-blue-600 text-white font-medium flex items-center justify-center text-sm shadow-lg shadow-blue-500/30">1</button>
            <button className="h-8 w-8 rounded-full bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 font-medium flex items-center justify-center text-sm transition-colors">2</button>
            <button className="h-8 w-8 rounded-full bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 font-medium flex items-center justify-center text-sm transition-colors">3</button>
            <span className="text-gray-400 dark:text-gray-600 text-sm px-1">...</span>
            <button className="h-8 w-8 rounded-full bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
