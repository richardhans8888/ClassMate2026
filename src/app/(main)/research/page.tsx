import { ResearchFeed } from "@/components/features/research/ResearchFeed";
import { Suspense } from "react";

export default function ResearchIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A]">
      <main className="py-8">
        <Suspense fallback={<div className="text-center text-gray-500 py-12">Loading…</div>}>
          <ResearchFeed />
        </Suspense>
      </main>
    </div>
  );
}
