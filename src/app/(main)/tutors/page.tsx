"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Star, Play, Award, Filter, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const tutors = [
  {
    id: 1,
    name: "Dr. Alan Grant",
    subject: "Science",
    specialties: ["Dinosaurs", "Fossils", "Evolutionary Biology"],
    rating: 4.9,
    reviews: 120,
    hourlyRate: 50,
    bio: "Experienced paleontologist with a passion for teaching about prehistoric life. I make learning about dinosaurs fun and engaging!",
    avatar: "AG",
    available: true
  },
  {
    id: 2,
    name: "Ellie Sattler",
    subject: "Science",
    specialties: ["Paleobotany", "Plant Biology", "Ecology"],
    rating: 5.0,
    reviews: 95,
    hourlyRate: 45,
    bio: "Specializing in ancient plant life and ecosystems. Let's explore the world of plants together!",
    avatar: "ES",
    available: true
  },
  {
    id: 3,
    name: "Ian Malcolm",
    subject: "Mathematics",
    specialties: ["Chaos Theory", "Calculus", "Probability"],
    rating: 4.7,
    reviews: 200,
    hourlyRate: 60,
    bio: "Life finds a way, and so will you with your math problems. I specialize in complex systems and chaos theory.",
    avatar: "IM",
    available: false
  },
  {
    id: 4,
    name: "John Hammond",
    subject: "Business",
    specialties: ["Entrepreneurship", "Management", "Genetics"],
    rating: 4.5,
    reviews: 80,
    hourlyRate: 100,
    bio: "I spare no expense in providing top-tier business tutoring. Learn how to build an empire.",
    avatar: "JH",
    available: true
  }
];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Science",
  "History",
  "Literature",
  "Languages",
  "Business",
  "Computer Science",
  "Art"
];

// Reusable Dropdown Component
interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs md:text-sm rounded-full border px-3 py-1.5 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-white/10 transition-colors"
      >
        <span>{label}: <span className="font-semibold text-gray-900 dark:text-white">{value}</span></span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1F293B] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="py-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                    value === option 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {option}
                  {value === option && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TutorsPage() {
  const [activeSubject, setActiveSubject] = useState("All Subjects");
  const [activeSort, setActiveSort] = useState("Recommended");

  const filteredTutors = tutors.filter((tutor) => {
    if (activeSubject === "All Subjects") return true;
    return tutor.subject === activeSubject;
  }).sort((a, b) => {
    if (activeSort === "Price: Low to High") return a.hourlyRate - b.hourlyRate;
    if (activeSort === "Price: High to Low") return b.hourlyRate - a.hourlyRate;
    if (activeSort === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Find a Tutor</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Connect with expert tutors for personalized learning.
        </p>
      </div>

      {/* Hero: Featured & Top Rated */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="text-gray-900 dark:text-white">Featured</span>{' '}
              <span className="text-blue-600">&amp; Top Rated</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Connect with our most impactful mentors and high-demand workshops.
            </p>
          </div>
          <div className="hidden md:flex gap-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Tutor Card */}
          <div className="relative rounded-2xl overflow-hidden border bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 shadow-md min-h-[360px] md:min-h-[420px]">
            <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(transparent,rgba(0,0,0,0.6))]" />
            <div className="relative p-6 md:p-10 text-gray-900 dark:text-white h-full flex flex-col justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/90 text-black border border-yellow-400">
                <Award className="h-3 w-3" />
                Tutor of the Month
              </span>
              <div>
                <h3 className="text-2xl md:text-4xl font-extrabold mt-4">Sarah Jenkins</h3>
                <p className="text-gray-600 dark:text-white/80 text-sm md:text-base leading-relaxed mt-3 max-w-prose">
                Unlock the universe with visual learning. Sarah excels at breaking down complex topics with clarity.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Link href="/profile">
                  <Button className="shadow">View Profile</Button>
                </Link>
                <Button variant="ghost" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Intro
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Workshop Card */}
          <div className="relative rounded-2xl overflow-hidden border bg-white dark:bg-slate-900 shadow-md min-h-[360px] md:min-h-[420px]">
            <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent)]" />
            <div className="relative p-6 md:p-10 text-gray-900 dark:text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl md:text-3xl font-extrabold">Python for Data Science</h3>
                <span className="text-xs font-bold bg-rose-500 text-white px-2 py-1 rounded-full">
                  3 Spots Left
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-sm">4.9</span>
                <span className="text-xs text-gray-600 dark:text-white/70">(128 reviews)</span>
              </div>
              <p className="text-gray-600 dark:text-white/80 text-sm md:text-base leading-relaxed mt-2 max-w-prose">
                Interactive cohort designed to get you analyzing data quickly. Perfect for beginners transitioning to tech.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-gray-100 text-gray-700 border border-gray-200 dark:bg-white/10 dark:text-white dark:border-white/10 px-2.5 py-1 rounded-full">Live Coding</span>
                <span className="text-xs bg-gray-100 text-gray-700 border border-gray-200 dark:bgWhite/10 dark:text-white dark:border-white/10 px-2.5 py-1 rounded-full">Group Projects</span>
                <span className="text-xs bg-gray-100 text-gray-700 border border-gray-200 dark:bg-white/10 dark:text-white dark:border-white/10 px-2.5 py-1 rounded-full">Certificate</span>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-xs text-gray-500 dark:text-white/60">Starts in</span>
                <Button variant="outline" className="bg-white text-slate-900 hover:bg-gray-100">
                  Reserve Spot
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <FilterDropdown 
            label="Subject" 
            value={activeSubject} 
            options={subjects} 
            onChange={setActiveSubject} 
          />

          <FilterDropdown 
            label="Sort By" 
            value={activeSort} 
            options={["Recommended", "Top Rated", "Price: Low to High", "Price: High to Low"]} 
            onChange={setActiveSort} 
          />
        </div>

        {/* Available Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {filteredTutors.length > 0 ? (
            filteredTutors.map((tutor) => (
            <motion.div
              key={tutor.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    {tutor.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{tutor.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tutor.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="h-3 w-3 fill-amber-500" />
                  {tutor.rating}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 h-10">
                {tutor.bio}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {tutor.specialties.slice(0, 2).map(s => (
                  <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {s}
                  </span>
                ))}
                {tutor.specialties.length > 2 && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    +{tutor.specialties.length - 2}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <span className="font-bold text-gray-900 dark:text-white">
                  ${tutor.hourlyRate}<span className="text-xs font-normal text-gray-500">/hr</span>
                </span>
                <Link href={`/tutors/${tutor.id}`}>
                  <Button size="sm" variant="ghost" className="h-8 px-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    Profile
                    <ChevronDown className="h-3 w-3 ml-1 -rotate-90" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              <p>No tutors found matching your filters.</p>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setActiveSubject("All Subjects");
                  setActiveSort("Recommended");
                }}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Modules Section (under hero) */}
      <section className="mb-12">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
          {['All Modules','Computer Science','Mathematics','Engineering','Humanities','Business'].map((c, idx) => (
            <button
              key={c}
              className={`text-xs md:text-sm rounded-full border px-3 py-1.5 ${
                idx === 0
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="p-8 md:p-12 rounded-3xl bg-white text-gray-900 dark:bg-gradient-to-r dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 dark:text-white border shadow-sm mb-8 min-h-[180px] flex items-center justify-between overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="font-extrabold text-xl md:text-2xl">Can’t find a tutor right now?</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-white/80 mt-1">
              Our AI Tutor specializes in many modules and answers in seconds.
            </p>
          </div>
          <Link href="/ai-tutor">
            <Button variant="outline" className="bg-white text-slate-900 hover:bg-gray-100">
              Try AI Assistant
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { code: 'CS-301', title: 'Data Structures & Algorithms', desc: 'Master trees, graphs, and sorting algorithms with expert guidance.', online: 5, tag: 'AI Ready', color: 'bg-blue-500/10 text-blue-500' },
            { code: 'MATH-202', title: 'Linear Algebra II', desc: 'Vector spaces, eigenvalues, and complex matrices explained simply.', online: 12, tag: 'AI Ready', color: 'bg-orange-500/10 text-orange-500' },
            { code: 'LIT-240', title: 'Modernist Poetry', desc: 'Exploring Eliot, Pound, and Woolf. Essay help available.', online: 1, tag: '1 Tutor Available', color: 'bg-pink-500/10 text-pink-500' },
            { code: 'PHYS-400', title: 'Quantum Mechanics I', desc: 'Wave functions and the Schrödinger equation.', online: 0, tag: 'Use AI Bot', color: 'bg-indigo-500/10 text-indigo-500' },
            { code: 'ECON-101', title: 'Microeconomics', desc: 'Supply, demand, and market equilibrium principles.', online: 3, tag: 'AI Ready', color: 'bg-emerald-500/10 text-emerald-500' },
            { code: 'PSY-200', title: 'Cognitive Psychology', desc: 'Memory, perception, and problem‑solving processes.', online: 7, tag: 'AI Ready', color: 'bg-rose-500/10 text-rose-500' },
          ].map((m, i) => (
            <div key={m.code} className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 flex flex-col justify-between h-full hover:bg-gray-50 dark:hover:bg-[#253045] transition-colors shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${m.color}`}>
                    {m.code}
                  </span>
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="h-6 w-6 rounded-full border-2 border-white dark:border-[#1e293b] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-500">
                        {/* Placeholder avatars */}
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-400 to-gray-600 opacity-50"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{m.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                  {m.desc}
                </p>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-medium border-t border-gray-100 dark:border-gray-700/50 pt-4">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {m.online} Tutors Online
                </div>
                {m.tag.includes('AI') && (
                  <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                     <Award className="h-3 w-3" />
                     AI Ready
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
