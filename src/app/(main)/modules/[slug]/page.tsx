"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Calendar, Users, BookOpen, Star, Play } from "lucide-react";

export default function ModuleDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const slugFromParams = (params as any)?.slug;
  const raw =
    typeof slugFromParams === "string"
      ? slugFromParams
      : Array.isArray(slugFromParams)
        ? slugFromParams.join("-")
        : "module";
  const safe = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  const title = safe
    .split("-")
    .filter(Boolean)
    .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
  const outcomes = [
    {
      title: "Qubit Mechanics",
      desc: "Understand superposition and entanglement principles.",
    },
    {
      title: "Quantum Gates",
      desc: "Learn to manipulate qubits using single and multi‑qubit gates.",
    },
    {
      title: "Shor’s Algorithm",
      desc: "Dive into prime factorization and cryptography impacts.",
    },
    {
      title: "Error Correction",
      desc: "Study methods to protect quantum information from noise.",
    },
  ];
  const tutors = [
    {
      id: 1,
      name: "Dr. Aris Thorne",
      role: "PhD, Physics @ MIT",
      rate: 80,
      rating: 5.0,
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      role: "Researcher @ Google",
      rate: 120,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Kenji Sato",
      role: "MSc, Quantum @ Stanford",
      rate: 85,
      rating: 4.8,
    },
  ];
  const weeks = [
    {
      label: "Week 1-2",
      title: "Linear Algebra & Physics Foundations",
      desc: "Matrices, vectors, and the physical basis of quantum mechanics required for computing.",
    },
    {
      label: "Week 3-4",
      title: "Quantum Gates & Circuits",
      desc: "Building blocks of quantum algorithms. Designing simple circuits.",
    },
    {
      label: "Week 5-6",
      title: "Algorithms & Complexity",
      desc: "Grover’s search, Simon’s problem, and introduction to quantum complexity classes.",
    },
    {
      label: "Week 7-8",
      title: "Final Project & Review",
      desc: "Implement a quantum algorithm on a simulator or real quantum hardware.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0A0F1F] dark:text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/tutors">
          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 -ml-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>

        <div className="rounded-3xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1117] mb-6">
          <div className="p-6 md:p-8 relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
                Advanced Module
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-3 h-3 fill-yellow-400" />
                <span>4.9</span>
                <span className="text-gray-500 dark:text-gray-400">
                  (1.2k reviews)
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-3">
              {title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
              Master the fundamental concepts and algorithms in this
              comprehensive 8‑week module designed for future engineers.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                className="bg-indigo-600 hover:bg-indigo-500"
                onClick={() => {
                  try {
                    if (typeof window !== "undefined") {
                      const enrolled = JSON.parse(
                        localStorage.getItem("enrolledModules") || "[]",
                      );
                      const next = Array.isArray(enrolled) ? enrolled : [];
                      if (!next.includes(raw)) next.push(raw);
                      localStorage.setItem(
                        "enrolledModules",
                        JSON.stringify(next),
                      );
                    }
                  } catch {}
                  window.location.href = "/tutors";
                }}
              >
                Enroll Now
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/10"
              >
                Save Course
              </Button>
              <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 dark:bg-white/10 dark:text-white dark:border-white/20">
                8 Weeks
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 dark:bg-white/10 dark:text-white dark:border-white/20">
                Intermediate
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1117] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">What You Will Learn</h2>
                <button className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Download Syllabus
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outcomes.map((o, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 dark:bg-[#0D1420] dark:border-gray-800"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-300">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-semibold">{o.title}</div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {o.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1117] p-6">
              <h3 className="font-semibold mb-4">Course Timeline</h3>
              <div className="space-y-3">
                {weeks.map((w, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 dark:bg-[#0D1420] dark:border-gray-800"
                  >
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-300 font-bold uppercase">
                      {w.label}
                    </div>
                    <div className="text-sm font-semibold mt-1">{w.title}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {w.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1117] overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src="https://images.unsplash.com/photo-1556157382-97eda0fe8aae?q=80&w=1600&auto=format&fit=crop"
                  alt="Course Intro"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md border border-gray-300 dark:border-white/30 flex items-center justify-center text-gray-900 dark:text-white">
                    <Play className="w-7 h-7" />
                  </button>
                </div>
              </div>
              <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
                Watch Course Intro
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1117] p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" /> Available Experts
                </h3>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Highest Rated
                </span>
              </div>
              <div className="space-y-3">
                {tutors.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 dark:bg-[#0D1420] dark:border-gray-800"
                  >
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {t.role}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-yellow-600 dark:text-yellow-400 mt-1">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span>{t.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        ${t.rate}/hr
                      </span>
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-right">
                <Link
                  href="/tutors"
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View all tutors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
