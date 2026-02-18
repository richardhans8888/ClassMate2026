
"use client";

import Link from 'next/link';
import { User, Bell, Menu, BookOpen, Trophy, LogOut, CreditCard, Settings, Users, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ModeToggle } from '@/components/mode-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none group rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F172A] transition-all">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] cursor-pointer group-hover:scale-105 transition-transform">
                     <div className="h-full w-full rounded-full bg-white dark:bg-[#0F172A] flex items-center justify-center overflow-hidden">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                     </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Alex Rivera</p>
                    <p className="text-xs leading-none text-muted-foreground">alex@mit.edu</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Switch Account</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer" onClick={() => window.location.href = '/'}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/tutor-studio" className="cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Tutor Studio</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/purchases" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Purchase & Memberships</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#0F1117] border-gray-200 dark:border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Switch Account</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Select an account to switch to or add a new one.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                       <div className="h-full w-full rounded-full bg-white dark:bg-[#0F172A] flex items-center justify-center overflow-hidden">
                          <User className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                       </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Rivera</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">alex@mit.edu</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                   <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                   </div>
                   <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Sarah Jenkins</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">sarah.j@gmail.com</p>
                   </div>
                </div>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[#0F1117] px-2 text-gray-500 dark:text-gray-400">
                      Or
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-dashed border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
