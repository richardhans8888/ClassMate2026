"use client";

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { BookOpen, Moon, Mail, Lock, User, Eye, EyeOff, Loader2, X } from 'lucide-react';
import ColorThief from 'colorthief';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase';

const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

type AuthModal = null | 'signup' | 'signin';

export default function Home() {
  const [session, setSession] = useState<boolean>(false);
  const [themeColor, setThemeColor] = useState('#5A3DFF');
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceAuth = typeof window !== 'undefined' && (searchParams.get('add_account') === '1');

  useEffect(() => {
    // TEST MODE: skip Supabase auth entirely
    if (TEST_MODE) {
      setSession(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = '/011620_Features_KS_004_2500.webp';
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        if (color) setThemeColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } catch (error) {
        console.error("Error extracting color:", error);
      }
    };
  }, []);

  const resetForm = () => {
    setEmail(''); setPassword(''); setDisplayName('');
    setError(null); setSuccess(null); setShowPassword(false);
  };

  const openModal = (mode: AuthModal) => {
    resetForm();
    setAuthModal(mode);
  };

  const handleGoogleSignIn = async () => {
    if (TEST_MODE) { setSession(true); return; }
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    // TEST MODE: any credentials work
    if (TEST_MODE) {
      setSession(true);
      setAuthModal(null);
      return;
    }

    if (!email || !password) { setError('Email and password are required'); return; }
    if (authModal === 'signup' && !displayName) { setError('Display name is required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setIsLoading(true);
    setError(null);

    try {
      if (authModal === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: displayName } },
        });
        if (error) throw error;
        setSuccess('Account created! Please sign in.');
        setAuthModal('signin');
        resetForm();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthModal(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (session && !forceAuth) {
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
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/011620_Features_KS_004_2500.webp')`, filter: 'brightness(0.7)' }}
        />
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

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24 py-10 relative">
        <button className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
          <Moon className="w-5 h-5" />
          <Moon className="w-5 h-5" />
        </button>

        <div className="max-w-[480px] w-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 rounded-lg transition-colors duration-500" style={{ backgroundColor: themeColor }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              ClassMate
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-[56px] font-bold text-gray-900 mb-3 tracking-tight">Happening now</h1>
          <p className="text-2xl font-medium text-gray-500 mb-12">Join ClassMate today.</p>

          {/* Test mode banner */}
          {TEST_MODE && (
            <div className="mb-6 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
              <span>🧪</span>
              <span><strong>Test mode on</strong> — any button logs you in instantly. Set <code>NEXT_PUBLIC_TEST_MODE=false</code> to disable.</span>
            </div>
          )}

          {success && (
            <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl p-3">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <Button
              variant="outline"
            <Button
              variant="outline"
              className="w-full rounded-full bg-white text-gray-700 hover:bg-gray-50 border-gray-200 h-12 font-medium text-base flex items-center justify-center gap-3 transition-all"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <Button
              variant="outline"

            <Button
              variant="outline"
              className="w-full rounded-full bg-white text-gray-700 hover:bg-gray-50 border-gray-200 h-12 font-medium text-base flex items-center justify-center gap-3 transition-all"
              onClick={() => TEST_MODE ? setSession(true) : setError('Apple sign in coming soon')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.64 3.4 1.63-3.12 1.88-2.6 5.79.43 7.1-.7 1.75-1.6 3.44-2.48 4.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.64 3.4 1.63-3.12 1.88-2.6 5.79.43 7.1-.7 1.75-1.6 3.44-2.48 4.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Sign up with Apple
            </Button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-sm text-gray-400 pb-1">or</span>
              <div className="h-px bg-gray-200 flex-1"></div>
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-sm text-gray-400 pb-1">or</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <Button
              className="w-full rounded-full text-white border-none h-12 font-bold text-base shadow-sm hover:shadow transition-all duration-500 hover:brightness-110 flex items-center justify-center"
              style={{ backgroundColor: themeColor }}
              onClick={() => TEST_MODE ? setSession(true) : openModal('signup')}
              disabled={isLoading}
            >
              Create account
              Create account
            </Button>

            <p className="text-[11px] text-gray-500 leading-normal max-w-sm">
              By signing up, you agree to the{' '}
              <a href="#" className="hover:underline" style={{ color: themeColor }}>Terms of Service</a> and{' '}
              <a href="#" className="hover:underline" style={{ color: themeColor }}>Privacy Policy</a>, including{' '}
              <a href="#" className="hover:underline" style={{ color: themeColor }}>Cookie Use</a>.
            </p>

            <div className="pt-12">
              <h3 className="text-base font-bold text-gray-900 mb-4">Already have an account?</h3>
              <Button
                variant="outline"
                className="w-full rounded-full bg-white border-gray-200 hover:bg-gray-50 h-12 font-bold text-base transition-colors duration-500 flex items-center justify-center"
                style={{ color: themeColor }}
                onClick={() => TEST_MODE ? setSession(true) : openModal('signin')}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {authModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => { setAuthModal(null); resetForm(); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {authModal === 'signup' ? 'Create your account' : 'Sign in to ClassMate'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {authModal === 'signup' ? 'Start your learning journey today' : 'Welcome back!'}
            </p>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">{error}</div>
            )}

            <div className="space-y-4">
              {authModal === 'signup' && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleEmailAuth}
                disabled={isLoading}
                className="w-full py-2.5 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 hover:brightness-110"
                style={{ backgroundColor: themeColor }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {authModal === 'signup' ? 'Create Account' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-500">
                {authModal === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  onClick={() => openModal(authModal === 'signup' ? 'signin' : 'signup')}
                  className="font-medium hover:underline"
                  style={{ color: themeColor }}
                >
                  {authModal === 'signup' ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

