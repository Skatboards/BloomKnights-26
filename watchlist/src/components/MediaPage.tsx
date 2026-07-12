"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import MediaCardGrid, { filterMediaCards } from "@/components/MediaCardGrid";
import type { PlaceholderMediaCard } from "@/data/placeholderMedia";

const navItems = ["Home", "Shows", "Movies", "Books", "Games", "Add"];

type MediaPageProps = {
  activeItem: "Shows" | "Movies" | "Books" | "Games";
  eyebrow: string;
  title: string;
  description: string;
  cards: PlaceholderMediaCard[];
};

export default function MediaPage({
  activeItem,
  eyebrow,
  title,
  description,
  cards,
}: MediaPageProps) {
  const [query, setQuery] = useState("");
  const filteredCards = useMemo(() => filterMediaCards(cards, query), [cards, query]);

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Navbar
        navItems={navItems}
        activeItem={activeItem}
        searchValue={query}
        onSearchChange={setQuery}
        searchHint="Filtering this tab. Press Enter for global results."
      />

      <section
        id="top"
        className="border-b border-[color:var(--border)] bg-[color:var(--background)]"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[color:var(--accent)]">
              {eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
              {description}
            </p>
            {query.trim() ? (
              <p className="mt-5 text-sm text-[color:var(--muted)]">
                Showing {filteredCards.length} of {cards.length} {activeItem.toLowerCase()} for "{query.trim()}".
              </p>
            ) : null}
          </div>

          <MediaCardGrid
            cards={filteredCards}
            emptyTitle={`No ${activeItem.toLowerCase()} found`}
            emptyDescription="Try a different title, source, status, tag, or media detail."
          />
        </div>
      </section>
    </main>
  );
}
