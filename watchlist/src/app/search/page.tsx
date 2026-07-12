import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResultsPage from "@/components/SearchResultsPage";
import { getAllMediaCards } from "@/lib/mediaDb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search | WatchList",
  description: "Search across media saved in WatchList.",
};

function SearchFallback() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <p className="text-sm text-[color:var(--muted)]">Loading search...</p>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResultsPage cards={getAllMediaCards()} />
    </Suspense>
  );
}
