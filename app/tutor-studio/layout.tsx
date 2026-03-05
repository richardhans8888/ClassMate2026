"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  LogOut,
  Home,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button2";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/tutor-studio", icon: LayoutDashboard },
  {
    name: "Student Requests",
    href: "/tutor-studio/requests",
    icon: Users,
    count: 3,
  },
  { name: "Active Courses", href: "/tutor-studio/courses", icon: BookOpen },
  { name: "Earnings", href: "/tutor-studio/earnings", icon: DollarSign },
  { name: "Schedule", href: "/tutor-studio/schedule", icon: Calendar },
];

export default function TutorStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [isTutor, setIsTutor] = useState<boolean>(false);
  const [gateOpen, setGateOpen] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const e =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;
      const role =
        typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
      setEmail(e);
      let tutor = role === "tutor";
      if (!role && e) {
        tutor = e === "alex@mit.edu";
      }
      setIsTutor(!!tutor);
      setGateOpen(!tutor);
    } catch {
      setIsTutor(false);
      setGateOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    setGateOpen(false);
    setDismissed(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 dark:bg-[#0F1115] dark:text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1115]">
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? "bg-gray-100 text-teal-600 border border-teal-200 dark:bg-[#1A1F26] dark:text-teal-400 dark:border-teal-900/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#1A1F26] dark:hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-gray-500"}`}
                  />
                  {item.name}
                </div>
                <div className="flex items-center gap-2">
                  {item.count && (
                    <span className="bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                  {!isTutor && item.name !== "Dashboard" && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Register
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#1A1F26] pl-3"
            >
              <Home className="w-5 h-5 mr-3" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/10 pl-3"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-[#0F1115]">
        {/* Reminder banner shown after dismissing the dialog */}
        {!isTutor && dismissed && (
          <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-amber-50 border-b border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20">
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              You're browsing in preview mode.{" "}
              <Link
                href="/tutor-studio/register"
                className="underline underline-offset-2 font-medium hover:text-amber-900 dark:hover:text-amber-300"
              >
                Register as a tutor
              </Link>{" "}
              to unlock all features.
            </div>
            <button
              onClick={() => setDismissed(false)}
              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="h-full p-8">{children}</div>
      </main>

      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="bg-white dark:bg-[#0F1117] border border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              You're Not a Registered Tutor
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Please register to access Tutor Studio{email ? ` (${email})` : ""}
              .
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={handleDismiss}
              >
                Preview only
              </Button>
              <div className="flex gap-2">
                <Link href="/">
                  <Button variant="outline">Go Back</Button>
                </Link>
                <Link href="/tutor-studio/register">
                  <Button>Register as Tutor</Button>
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}