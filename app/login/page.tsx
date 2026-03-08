"use client";

import { useState, useEffect } from 'react';
import { BookOpen, Mail, Lock, Eye, EyeOff, Loader2, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button2';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ColorThief from 'colorthief';
import { auth } from 'lib/firebase';
import { authClient } from '@/lib/auth-client';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('#5A3DFF');
  const router = useRouter();

  useEffect(() => {
    const img = new Image();
    img.src = '/hero-classmate.webp';
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        if (color) setThemeColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } catch (e) {
        console.error('Color extraction failed:', e);
      }
    };
  }, []);

  const createSession = async (idToken: string) => {
    const res = await fetch("/api/auth/firebase", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to create session");
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) { setError('Email and password are required'); return; }
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        if (error.message?.toLowerCase().includes("invalid credentials") ||
          error.message?.toLowerCase().includes("invalid email or password")) {
          setError("Invalid email or password.");
        } else if (error.message?.toLowerCase().includes("user not found")) {
          setError("No account found with this email. Please sign up first.");
        } else {
          setError(error.message ?? "Sign-in failed. Please try again.");
        }
        return;
      }

      if (data) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      await createSession(idToken);

      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Google sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      {/* Left Panel — same as landing page */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/hero-classmate.webp')`, filter: 'brightness(0.7)' }}
        />
        <div className="relative z-10 mt-auto p-12 w-full max-w-2xl">
          <blockquote className="font-serif text-4xl md:text-5xl font-medium text-white leading-tight mb-6">
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
          </blockquote>
          <div className="flex items-center text-white/80 font-medium">
            <div className="h-px w-8 bg-white/50 mr-3"></div>
            ClassMate Community
          </div>
        </div>
      </div>

      {/* Right Panel — the modal form, now a full page */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24 py-10 relative">
        <button className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
          <Moon className="w-5 h-5" />
        </button>

        <div className="max-w-[480px] w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-lg" style={{ backgroundColor: themeColor }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">ClassMate</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Google */}
            <Button
              variant="outline"
              className="w-full rounded-full bg-white text-gray-700 hover:bg-gray-50 border-gray-200 h-12 font-medium text-base flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-sm text-gray-400">or</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Email */}
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
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                />
              </div>
            </div>

            {/* Password */}
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
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
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

            {/* Submit */}
            <button
              onClick={handleEmailLogin}
              disabled={isLoading}
              className="w-full py-2.5 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 hover:brightness-110"
              style={{ backgroundColor: themeColor }}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>

            {/* Switch to register */}
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium hover:underline"
                style={{ color: themeColor }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}