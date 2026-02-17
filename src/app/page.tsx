
"use client";

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { BookOpen, Moon } from 'lucide-react';
import ColorThief from 'colorthief';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [themeColor, setThemeColor] = useState('#5A3DFF'); // Default purple
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for login status
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }
    setIsLoading(false);

    const img = new Image();
    img.src = '/011620_Features_KS_004_2500.webp';
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        if (color) {
          setThemeColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        }
      } catch (error) {
        console.error("Error extracting color:", error);
      }
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0F172A] transition-colors duration-300">
        <Header />
        <main className="flex-1">
          <Dashboard />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Panel - Illustration & Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ 
               backgroundImage: `url('/011620_Features_KS_004_2500.webp')`,
               filter: 'brightness(0.7)'
            }}
        />
        
        {/* Quote Content */}
        <div className="relative z-10 mt-auto p-12 w-full max-w-2xl">
            <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full w-fit mb-6 border border-white/10">
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
               </svg>
            </div>
            <blockquote className="font-serif text-4xl md:text-5xl font-medium text-white leading-tight mb-6">
               "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
            </blockquote>
            <div className="flex items-center text-white/80 font-medium">
               <div className="h-px w-8 bg-white/50 mr-3"></div>
               ClassMate Community
            </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24 py-10 relative">
        {/* Theme Toggle */}
        <button className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
            <Moon className="w-5 h-5" />
        </button>

        <div className="max-w-[480px] w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 rounded-lg transition-colors duration-500" style={{ backgroundColor: themeColor }}>
               <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">ClassMate</span>
          </div>

          <h1 className="font-serif text-5xl md:text-[56px] font-bold text-gray-900 mb-3 tracking-tight">Happening now</h1>
          <p className="text-2xl font-medium text-gray-500 mb-12">Join ClassMate today.</p>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full rounded-full bg-white text-gray-700 hover:bg-gray-50 border-gray-200 h-12 font-medium text-base flex items-center justify-center gap-3 transition-all"
              onClick={handleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full rounded-full bg-white text-gray-700 hover:bg-gray-50 border-gray-200 h-12 font-medium text-base flex items-center justify-center gap-3 transition-all"
              onClick={handleLogin}
            >
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.64 3.4 1.63-3.12 1.88-2.6 5.79.43 7.1-.7 1.75-1.6 3.44-2.48 4.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
               </svg>
              Sign up with Apple
            </Button>

            <div className="flex items-center gap-3 py-2">
               <div className="h-px bg-gray-200 flex-1"></div>
               <span className="text-sm text-gray-400 pb-1">or</span>
               <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <Button 
               className="w-full rounded-full text-white border-none h-12 font-bold text-base shadow-sm hover:shadow transition-all duration-500 hover:brightness-110 flex items-center justify-center"
               style={{ backgroundColor: themeColor }}
               onClick={handleLogin}
            >
               Create account
            </Button>

            <p className="text-[11px] text-gray-500 leading-normal max-w-sm">
               By signing up, you agree to the <a href="#" className="hover:underline transition-colors duration-500" style={{ color: themeColor }}>Terms of Service</a> and <a href="#" className="hover:underline transition-colors duration-500" style={{ color: themeColor }}>Privacy Policy</a>, including <a href="#" className="hover:underline transition-colors duration-500" style={{ color: themeColor }}>Cookie Use</a>.
            </p>

            <div className="pt-12">
               <h3 className="text-base font-bold text-gray-900 mb-4">Already have an account?</h3>
               <Button 
                  variant="outline" 
                  className="w-full rounded-full bg-white border-gray-200 hover:bg-gray-50 h-12 font-bold text-base transition-colors duration-500 flex items-center justify-center"
                  style={{ color: themeColor }}
                  onClick={handleLogin}
               >
                  Sign in
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
