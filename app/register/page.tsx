"use client";

import { useState, useEffect } from "react";
import { BookOpen, User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getAvatarUrl } from "@/lib/avatar";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [themeColor] = useState("#5A3DFF");

    const validate = (): string | null => {
        if (!name.trim()) return "Name is required.";
        if (!email.trim()) return "Email is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Please enter a valid email address.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (password !== confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        setError(null);

        try {
            const image = getAvatarUrl(name);
            const { data, error } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
                image,
                callbackURL: "/dashboard",
            });

            if (error) { toast.error(error.message ?? "Registration failed."); return; }
            if (data) {
                toast.success("Account created! Welcome to ClassMate.");
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err: unknown) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">

            {/* Left Panel — Form */}
            <div className="lg:w-1/2 flex flex-col min-h-screen relative">
                <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-16 pb-10">
                    <div className="w-full max-w-[420px]">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: themeColor }}>
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">ClassMate</span>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-1">Create your account</h2>
                        <p className="text-sm text-gray-500 mb-8">Start your learning journey today</p>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="At least 8 characters"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Repeat your password"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={() => handleSubmit()}
                                disabled={loading}
                                className="w-full py-3 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 hover:brightness-110"
                                style={{ backgroundColor: themeColor }}
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Create Account
                            </button>

                            <p className="text-[11px] text-gray-500 leading-normal">
                                By signing up, you agree to the{" "}
                                <a href="/terms" className="hover:underline" style={{ color: themeColor }}>Terms of Service</a>{" "}
                                and{" "}
                                <a href="/privacy" className="hover:underline" style={{ color: themeColor }}>Privacy Policy</a>.
                            </p>

                            <p className="text-center text-sm text-gray-500 pt-2">
                                Already have an account?{" "}
                                <Link href="/login" className="font-medium hover:underline" style={{ color: themeColor }}>
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Image (flipped from login) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/hero-classmate.webp')`, filter: "brightness(0.7)" }}
                />
                <div className="relative z-10 mt-auto p-12 w-full">
                    <blockquote className="font-serif text-4xl md:text-5xl font-medium text-white leading-tight mb-6">
                        &quot;The beautiful thing about learning is that nobody can take it away from you.&quot;
                    </blockquote>
                    <div className="flex items-center text-white/80 font-medium">
                        <div className="h-px w-8 bg-white/50 mr-3"></div>
                        ClassMate Community
                    </div>
                </div>
            </div>

        </div>
    );
}
