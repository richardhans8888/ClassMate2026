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
  Settings,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/tutor-studio", icon: LayoutDashboard },
  { name: "Student Requests", href: "/tutor-studio/requests", icon: Users, count: 3 },
  { name: "Active Courses", href: "#", icon: BookOpen },
  { name: "Earnings", href: "#", icon: DollarSign },
  { name: "Schedule", href: "/tutor-studio/schedule", icon: Calendar },
  { name: "AI Insights", href: "#", icon: Sparkles },
];

export default function TutorStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#0F1115] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-gray-800 bg-[#0F1115]">
        {/* Header/Logo area */}
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Tutor Studio
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[#1A1F26] text-teal-400 border border-teal-900/30" 
                    : "text-gray-400 hover:bg-[#1A1F26] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? "text-teal-400" : "text-gray-500"}`} />
                  {item.name}
                </div>
                {item.count && (
                  <span className="bg-teal-500/20 text-teal-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#1A1F26] pl-3">
              <Home className="w-5 h-5 mr-3" />
              Back to Home
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/10 pl-3">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0F1115]">
        <div className="h-full p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
