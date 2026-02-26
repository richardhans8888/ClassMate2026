 "use client";
 
 import Link from "next/link";
 import { Button } from "@/components/ui/Button";
 import { useMemo, useState, type CSSProperties } from "react";
 import { LayoutGrid, List, Users, BookOpen, ChevronRight } from "lucide-react";
 
 function toSlug(title: string) {
   return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
 }
 
 export default function MyModulesPage() {
   const [view, setView] = useState<"grid" | "list">("grid");
 
   const modules = useMemo(
     () => [
       {
         title: "Organic Chemistry II",
         code: "CHEM-201",
         professor: "Prof. H. White",
         image:
           "https://images.unsplash.com/photo-1520975922284-6a6fa1d6d095?q=80&w=1600&auto=format&fit=crop",
         progress: 82,
         status: "Active",
         upcoming: "Lab Report Due in 2 days",
         participants: 6,
       },
       {
         title: "Adv. Microeconomics",
         code: "ECON-305",
         professor: "Dr. S. Miller",
         image:
           "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop",
         progress: 45,
         status: "Ongoing",
         upcoming: "Midterm Prep Quiz",
         participants: 5,
       },
       {
         title: "Data Structures",
         code: "CS-202",
         professor: "Prof. A. Turing",
         image:
           "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1600&auto=format&fit=crop",
         progress: 90,
         status: "Active",
         upcoming: "Binary Trees Project",
         participants: 12,
       },
       {
         title: "Modern World History",
         code: "HIST-104",
         professor: "Prof. R. Geller",
         image:
           "https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1600&auto=format&fit=crop",
         progress: 25,
         status: "New",
         upcoming: "Read Chapter 4-6",
         participants: 0,
       },
     ],
     []
   );
 
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gradient-to-b dark:from-[#0A0F1F] dark:to-[#0B0E1A] dark:text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-3xl p-6 md:p-8 border bg-white border-gray-200 dark:bg-gradient-to-br dark:from-[#0E1530] dark:via-[#0B1226] dark:to-[#0A0F1F] dark:border-white/10 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="text-[11px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-200 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700/50 w-fit">
            Fall Semester 2023
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3">My Academic Journey</h1>
          <p className="text-sm text-gray-600 dark:text-slate-200 mt-2 max-w-2xl">
            Welcome back. Keep up the momentum for your mid-terms.
          </p>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
            <div className="rounded-xl p-4 border bg-gray-50 border-gray-200 dark:bg-white/10 dark:border-white/15">
              <div className="text-[11px] text-gray-500 dark:text-slate-300">Sem. Progress</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold">75%</div>
                <div className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold">On Track</div>
              </div>
            </div>
            <div className="rounded-xl p-4 border bg-gray-50 border-gray-200 dark:bg-white/10 dark:border-white/15">
              <div className="text-[11px] text-gray-500 dark:text-slate-300">Cum. GPA</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold">3.8</div>
                <div className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold">+0.2</div>
              </div>
            </div>
            <div className="rounded-xl p-4 border bg-gray-50 border-gray-200 dark:bg-white/10 dark:border-white/15">
              <div className="text-[11px] text-gray-500 dark:text-slate-300">Credits</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold">18</div>
              </div>
            </div>
          </div>
        </div>
 
         <div className="flex items-center justify-between mt-8">
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 rounded-sm bg-indigo-500/30 border border-indigo-400/30" />
             <h2 className="text-xl font-semibold">Current Modules</h2>
           </div>
          <div className="flex items-center gap-2">
            <button
              className={`h-9 w-9 rounded-lg border flex items-center justify-center ${
                view === "list"
                  ? "bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/10"
                  : "hover:bg-gray-50 dark:hover:bg-white/5 border-gray-200 dark:border-white/10"
              }`}
               onClick={() => setView("list")}
               aria-label="List view"
             >
               <List className="w-4 h-4" />
             </button>
            <button
              className={`h-9 w-9 rounded-lg border flex items-center justify-center ${
                view === "grid"
                  ? "bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/10"
                  : "hover:bg-gray-50 dark:hover:bg-white/5 border-gray-200 dark:border-white/10"
              }`}
               onClick={() => setView("grid")}
               aria-label="Grid view"
             >
               <LayoutGrid className="w-4 h-4" />
             </button>
           </div>
         </div>
 
         <div
           className={
             view === "grid"
               ? "mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
               : "mt-6 space-y-4"
           }
         >
           {modules.map((m) => {
             const slug = toSlug(m.title);
             const progressStyle: CSSProperties = {
               background: `conic-gradient(#6366f1 ${m.progress * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
             };
             return (
               <Link
                 key={slug}
                 href={`/modules/${slug}`}
                className="group rounded-2xl overflow-hidden border bg-white hover:bg-gray-50 border-gray-200 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] transition-colors"
               >
                 <div className="relative">
                   <div className="aspect-[16/9] w-full overflow-hidden">
                     <img
                       src={m.image}
                       alt={m.title}
                       className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                     />
                   </div>
                  <span className="absolute right-4 top-4 px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30">
                     {m.status}
                   </span>
 
                   <div className="absolute -bottom-5 left-5">
                     <div className="relative w-12 h-12 rounded-full grid place-items-center">
                       <div className="absolute inset-0 rounded-full" style={progressStyle} />
                      <div className="absolute inset-1 rounded-full bg-white dark:bg-[#0B0E1A]" />
                       <div className="relative text-xs font-bold">{m.progress}%</div>
                     </div>
                   </div>
                 </div>
 
                 <div className="p-5 pt-7">
                  <div className="text-[13px] text-gray-600 dark:text-slate-300">{m.professor} • {m.code}</div>
                  <div className="text-lg md:text-xl font-semibold mt-1 text-gray-900 dark:text-white">{m.title}</div>
 
                  <div className="mt-4 p-4 rounded-xl border bg-gray-50 border-gray-200 dark:bg-white/[0.03] dark:border-white/10 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-400/20 dark:text-indigo-300">
                       <BookOpen className="w-4 h-4" />
                     </div>
                     <div>
                      <div className="text-[11px] text-gray-500 dark:text-slate-400 uppercase font-bold">Upcoming Task</div>
                      <div className="text-sm text-gray-900 dark:text-white">{m.upcoming}</div>
                     </div>
                   </div>
 
                   <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300 text-sm">
                       <Users className="w-4 h-4" />
                       <span>{m.participants}</span>
                     </div>
                    <div className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-200">
                       Enter Class <ChevronRight className="w-4 h-4" />
                     </div>
                   </div>
                 </div>
               </Link>
             );
           })}
         </div>
       </div>
     </div>
   );
 }
