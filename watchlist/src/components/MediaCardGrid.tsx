"use client";

import { BookCard, GameCard, MovieCard, ShowCard } from "@/components/MediaCards";
import type { PlaceholderMediaCard } from "@/data/placeholderMedia";

type MediaCardGridProps = {
  cards: PlaceholderMediaCard[];
  emptyTitle?: string;
  emptyDescription?: string;
};

function searchableValues(card: PlaceholderMediaCard) {
  const values = [
    card.type,
    card.title,
    card.subtitle,
    card.description,
    card.provider,
    card.status,
    ...(card.tags ?? []),
    ...(card.meta?.flatMap((item) => [item.label, item.value]) ?? []),
  ];

  if (card.type === "book") {
    values.push(card.author, card.pageCount, card.isbn);
  }

  if (card.type === "show") {
    values.push(card.seasons, card.episodeCount, card.network);
  }

  if (card.type === "movie") {
    values.push(card.runtime, card.rating, card.releaseYear);
  }

  if (card.type === "game") {
    values.push(card.platform, card.studio, card.playtime);
  }

  return values.filter(Boolean).join(" ").toLowerCase();
}

export function filterMediaCards(cards: PlaceholderMediaCard[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return cards;
  }

  return cards.filter((card) => searchableValues(card).includes(normalizedQuery));
}

function MediaCardRenderer({ card }: { card: PlaceholderMediaCard }) {
  if (card.type === "book") {
    return <BookCard {...card} />;
  }

  if (card.type === "show") {
    return <ShowCard {...card} />;
  }

  if (card.type === "movie") {
    return <MovieCard {...card} />;
  }

  return <GameCard {...card} />;
}

export default function MediaCardGrid({
  cards,
  emptyTitle = "No media found",
  emptyDescription = "Try another search term or clear the search field.",
}: MediaCardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-[color:var(--foreground)]">
        <h2 className="text-xl font-semibold">{emptyTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <MediaCardRenderer key={`${card.type}-${card.title}`} card={card} />
      ))}
    </div>
  );
}
