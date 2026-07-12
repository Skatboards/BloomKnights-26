"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import MediaCardGrid, { filterMediaCards } from "@/components/MediaCardGrid";
import type { PlaceholderMediaCard } from "@/data/placeholderMedia";

const navItems = ["Home", "Shows", "Movies", "Books", "Games", "Add"];

type SearchResultsPageProps = {
  cards: PlaceholderMediaCard[];
};

export default function SearchResultsPage({ cards }: SearchResultsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const trimmedQuery = query.trim();
  const filteredCards = useMemo(
    () => filterMediaCards(cards, query),
    [cards, query],
  );

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const submitSearch = (nextQuery: string) => {
    const nextTrimmedQuery = nextQuery.trim();

    if (!nextTrimmedQuery) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(nextTrimmedQuery)}`);
  };

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Navbar
        navItems={navItems}
        activeItem="Search"
        searchValue={query}
        onSearchChange={setQuery}
        onSearchSubmit={submitSearch}
        searchHint="Filtering global results. Press Enter to update the URL."
      />

      <section className="border-b border-[color:var(--border)] bg-[color:var(--background)]">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[color:var(--accent)]">
              Search
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-5xl">
              Global media results
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
              Search across books, shows, movies, and games. Placeholder cards use the same client-side shape future API results can populate.
            </p>
            {trimmedQuery ? (
              <p className="mt-5 text-sm text-[color:var(--muted)]">
                Showing {filteredCards.length} of {cards.length} results for "{trimmedQuery}".
              </p>
            ) : (
              <p className="mt-5 text-sm text-[color:var(--muted)]">
                Enter a search term to narrow the placeholder catalog.
              </p>
            )}
          </div>

          <div className="mt-10">
            <MediaCardGrid
              cards={trimmedQuery ? filteredCards : cards}
              emptyTitle="No search results found"
              emptyDescription="Try another title, creator, source, status, tag, or media detail."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
