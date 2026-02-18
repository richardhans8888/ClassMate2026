"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  LogOut,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const navigation = [
  { name: "Dashboard", href: "/tutor-studio", icon: LayoutDashboard, current: true },
  { name: "Student Requests", href: "#", icon: Users, count: 3, current: false },
  { name: "Active Courses", href: "#", icon: BookOpen, current: false },
  { name: "Earnings", href: "#", icon: DollarSign, current: false },
  { name: "Schedule", href: "#", icon: Calendar, current: false },
  { name: "AI Insights", href: "#", icon: Sparkles, current: false },
];

export default function TutorStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 flex flex-col fixed h-full bg-[#0F1115] z-50">
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 p-[2px]">
              <div className="h-full w-full rounded-full bg-[#0F1115] overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" className="h-full w-full bg-[#FFD6A5]" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-sm">Alex Morgan</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400">Senior Tutor</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.current 
                  ? "bg-[#1A1F26] text-teal-400 border border-teal-900/30" 
                  : "text-gray-400 hover:bg-[#1A1F26] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.current ? "text-teal-400" : "text-gray-500"}`} />
                {item.name}
              </div>
              {item.count && (
                <span className="bg-teal-500/20 text-teal-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#1A1F26]">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}