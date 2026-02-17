
"use client";

import Link from 'next/link';
import { User, Bell, Menu, BookOpen, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-12">
        {/* Left: Logo */}
        <div className="flex items-center gap-8 md:gap-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
               <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">ClassMate</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/tutors" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              Tutors
            </Link>
            <Link href="/forums" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              Study Groups
            </Link>
            <Link href="/ai-tutor" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              Learn with AI
            </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          
          <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-[#1E293B] px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
             <Trophy className="h-4 w-4 text-yellow-500" />
             <span className="text-xs font-bold text-gray-700 dark:text-white">Lvl 12</span>
          </div>
          
          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </Button>

          <Link href="/profile">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] cursor-pointer hover:scale-105 transition-transform">
               <div className="h-full w-full rounded-full bg-white dark:bg-[#0F172A] flex items-center justify-center overflow-hidden">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-300" />
               </div>
            </div>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
