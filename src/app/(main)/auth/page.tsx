"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F172A]">
      <div className="w-full max-w-md bg-white dark:bg-[#0F1117] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Welcome
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Sign in or create an account to continue.
        </p>

        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F172A] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.setItem("isLoggedIn", "true");
                if (email) localStorage.setItem("userEmail", email);
              }
              router.push("/");
            }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
