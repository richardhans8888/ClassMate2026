"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

export default function MyModulesPage() {
  const defaultModules = ["server-module"];

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("enrolledModules");
      const arr = (() => {
        try {
          const parsed = JSON.parse(raw || "[]");
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })();
      let changed = false;
      for (const slug of defaultModules) {
        if (!arr.includes(slug)) {
          arr.push(slug);
          changed = true;
        }
      }
      if (changed) localStorage.setItem("enrolledModules", JSON.stringify(arr));
    } catch {}
  }, []);
  const enrolledRaw =
    typeof window !== "undefined"
      ? localStorage.getItem("enrolledModules")
      : null;
  const enrolled = (() => {
    try {
      const parsed = JSON.parse(enrolledRaw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const modules = Array.from(new Set([...defaultModules, ...enrolled])).map(
    (slug: string) => {
      const safe = (() => {
        try {
          return decodeURIComponent(slug);
        } catch {
          return slug;
        }
      })();
      const title = safe
        .split("-")
        .filter(Boolean)
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
      return { slug, title };
    },
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0A0F1F] dark:text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold">Your Modules</h1>
          <Link href="/tutors">
            <Button className="bg-indigo-600 hover:bg-indigo-500">
              Find a Tutor
            </Button>
          </Link>
        </div>

        {modules.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1117] p-8 text-center">
            <div className="text-lg font-semibold">No enrolled modules yet</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Enroll in a module to see it here.
            </p>
            <div className="mt-4">
              <Link href="/tutors">
                <Button
                  variant="outline"
                  className="border-gray-200 dark:border-gray-700"
                >
                  Explore Tutors
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => (
              <Link
                key={m.slug}
                href={`/modules/${m.slug}`}
                className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1117] p-6 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="text-sm font-semibold">{m.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Enrolled
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
