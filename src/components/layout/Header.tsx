import Link from 'next/link';
import { Search, User, Bell, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">EduConnect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/forums" className="hover:text-blue-600 transition-colors">
              Forums
            </Link>
            <Link href="/chat" className="hover:text-blue-600 transition-colors">
              Chat
            </Link>
            <Link href="/materials" className="hover:text-blue-600 transition-colors">
              Materials
            </Link>
            <Link href="/tutors" className="hover:text-blue-600 transition-colors">
              Tutors
            </Link>
            <Link href="/ai-tutor" className="hover:text-blue-600 transition-colors">
              AI Tutor
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-64 rounded-md border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="h-5 w-5" />
          </Button>

          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
