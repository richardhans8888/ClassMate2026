"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Cpu,
  FileText,
  BarChart3,
  Quote,
  Search,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Mock Data for the Article
const articleData = {
  title: "Neural Pathways in Collaborative Learning: Longitudinal Study",
  date: "Published Oct 25, 2023",
  authors: [
    { name: "Dr. Elias Thorne", role: "Oxford Neuroscience Lab", avatar: "ET" },
    {
      name: "Stanford University",
      role: "Affiliate Institution",
      avatar: "SU",
    },
  ],
  sections: [
    { id: "abstract", title: "Abstract" },
    { id: "methodology", title: "Methodology" },
    { id: "results", title: "Results" },
    { id: "discussion", title: "Discussion" },
    { id: "references", title: "References" },
  ],
};

export default function ArticlePage() {
  const [activeSection, setActiveSection] = useState("abstract");
  const [readingProgress, setReadingProgress] = useState(0);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      // Update reading progress
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      // Update active section
      const sections = articleData.sections.map((s) => s.id);
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1115] text-gray-300 font-sans selection:bg-blue-500/30">
      <div className="pt-8 pb-20 px-6 max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
        {/* Left Sidebar - Table of Contents */}
        <aside className="hidden lg:block col-span-3 sticky top-24 h-[calc(100vh-8rem)]">
          <div className="bg-[#151921] rounded-2xl p-6 border border-gray-800/50 h-full flex flex-col">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="mb-6 -ml-2 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Feed
              </Button>
            </Link>

            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-6">
              Jump To Section
            </h3>

            <nav className="space-y-1 flex-1">
              {articleData.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(section.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                    setActiveSection(section.id);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? "bg-blue-600/10 text-blue-400 border-l-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  {section.id === "abstract" && (
                    <FileText className="w-4 h-4" />
                  )}
                  {section.id === "methodology" && <Cpu className="w-4 h-4" />}
                  {section.id === "results" && (
                    <BarChart3 className="w-4 h-4" />
                  )}
                  {section.id === "discussion" && (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  {section.id === "references" && <Quote className="w-4 h-4" />}
                  {section.title}
                </a>
              ))}
            </nav>

            <div className="mt-auto space-y-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]">
                <Quote className="w-4 h-4 mr-2" />
                Cite This Article
              </Button>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Reading Progress</span>
                  <span>{Math.round(readingProgress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${readingProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-12 lg:col-span-9 space-y-12">
          {/* Hero Section */}
          <section className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 min-h-[400px] flex flex-col justify-end p-8 md:p-12 group">
            <div className="absolute inset-0 z-0">
              {/* Abstract Background Graphic */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/80 to-transparent" />
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Cpu className="w-64 h-64 text-blue-500 rotate-12" />
              </div>
            </div>

            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20 backdrop-blur-sm">
                  NEUROSCIENCE
                </span>
                <span className="text-gray-400 text-xs font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
                  {articleData.date}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] mb-8 tracking-tight font-serif">
                {articleData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6">
                {articleData.authors.map((author, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-black/40 backdrop-blur-sm pr-4 pl-2 py-1.5 rounded-full border border-white/10 hover:bg-black/60 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {author.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white leading-none">
                        {author.name}
                      </span>
                      <span className="text-[10px] text-gray-400 leading-none mt-1">
                        {author.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Abstract */}
          <section id="abstract" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-gray-800 flex-1" />
              <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase">
                Abstract
              </h2>
              <div className="h-px bg-gray-800 flex-1" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-xl leading-relaxed text-gray-300 first-letter:text-6xl first-letter:font-serif first-letter:text-blue-500 first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px] first-letter:font-bold">
                This longitudinal study investigates the neurobiological
                correlates of collaborative learning among university students.
                Using high-resolution functional Magnetic Resonance Imaging
                (fMRI), we monitored neural activity during group-based
                problem-solving tasks over a twenty-four month period. Our
                findings suggest that repeated social-academic interactions
                strengthen synaptic plasticity in the prefrontal cortex, leading
                to enhanced executive function and long-term retention compared
                to solitary study control groups.
              </p>
            </div>
          </section>

          {/* Methodology */}
          <section id="methodology" className="scroll-mt-32">
            <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-6">
              Methodology
            </h2>
            <div className="prose prose-invert prose-lg max-w-none text-gray-400">
              <p className="mb-8">
                A total of 450 subjects (ages 18-24) were randomly assigned to
                either a Collaborative Learning Group (CLG) or a Solitary Study
                Group (SSG). Over four academic semesters, participants engaged
                in bi-weekly sessions focused on complex theoretical physics.
              </p>

              <figure className="my-12 bg-[#151921] rounded-2xl border border-gray-800 overflow-hidden group">
                <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                  {/* Placeholder for Brain Scan Image */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2831&auto=format&fit=crop')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
                <figcaption className="p-4 border-t border-gray-800 flex justify-between items-center bg-[#0F1115]">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Figure 1.2: Neural Density Mapping
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    Heatmap illustrating voxel-wise changes in the dorsolateral
                    prefrontal cortex.
                  </span>
                </figcaption>
              </figure>

              <p>
                Data collection included bi-monthly fMRI scans, cognitive
                aptitude tests, and peer-review performance metrics. The study
                employed a double-blind protocol during the evaluation of
                synaptic connectivity scores to eliminate observer bias.
              </p>
            </div>
          </section>

          {/* Key Results */}
          <section id="results" className="scroll-mt-32">
            <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-6">
              Key Results
            </h2>
            <div className="grid gap-4">
              <div className="bg-[#151921] p-6 rounded-xl border-l-4 border-blue-500 flex gap-4 hover:bg-[#1A202C] transition-colors">
                <div className="bg-blue-500/20 p-2 rounded-full h-fit">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">
                    Theta Wave Synchronization
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Significant increase (p &lt; 0.05) in theta wave
                    synchronization between participants in the CLG during joint
                    problem-solving tasks, indicating shared cognitive states.
                  </p>
                </div>
              </div>

              <div className="bg-[#151921] p-6 rounded-xl border-l-4 border-blue-500 flex gap-4 hover:bg-[#1A202C] transition-colors">
                <div className="bg-blue-500/20 p-2 rounded-full h-fit">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Retention Rates</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Retention rates for complex concepts were 22% higher in
                    collaborative environments compared to solitary study,
                    persisting across 6-month follow-ups.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
