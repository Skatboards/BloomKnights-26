"use client";

import { useSyncExternalStore } from "react";
import Navbar from "@/components/Navbar";
import { BookCard, GameCard, MovieCard, ShowCard } from "@/components/MediaCards";
import { featuredMedia, placeholderCardsByMediaType, type PlaceholderMediaCard } from "@/data/placeholderMedia";

const navItems = ["Home", "Shows", "Movies", "Books", "Games"];

type MediaOption = {
  label: keyof typeof placeholderCardsByMediaType;
  title: string;
  description: string;
};

const mediaOptions: MediaOption[] = [
  {
    label: "Books",
    title: "Reading lists for every pace",
    description:
      "Collect novels, essays, graphic novels, reference titles, and rereads in one place.",
  },
  {
    label: "Shows",
    title: "Series worth returning to",
    description:
      "Track limited series, long-running favorites, anime, documentaries, and comfort watches.",
  },
  {
    label: "Movies",
    title: "A watchlist for any mood",
    description:
      "Save new releases, classics, festival picks, family nights, and late-night discoveries.",
  },
  {
    label: "Games",
    title: "Play queues that stay organized",
    description:
      "Keep tabs on campaign games, co-op nights, tabletop sessions, and quick casual picks.",
  },
];

type Theme = "light" | "dark";

const themeStorageKey = "watchlist-theme";
const themeChangeEvent = "watchlist-theme-change";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(themeStorageKey);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const activeTheme = document.documentElement.dataset.theme;
  if (activeTheme === "light" || activeTheme === "dark") {
    return activeTheme;
  }

  return getPreferredTheme();
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(themeChangeEvent, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(themeChangeEvent, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(themeStorageKey, theme);

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute(
      "content",
      theme === "dark" ? "#2a2f2a" : "#f4f4f5",
    );
  }

  window.dispatchEvent(new Event(themeChangeEvent));
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

export default function Home() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "dark",
  );

  const toggleTheme = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Navbar navItems={navItems} ctaText="Browse" />

      <section
        id="top"
        className="border-b border-[color:var(--border)] bg-[color:var(--background)]"
      >
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-[color:var(--accent)]">
              WatchList Home
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-6xl lg:text-7xl">
              One place to plan what you read, watch, and play next.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              WatchList gives a simple overview of books, shows, 
              movies, and games so you can plan and share what
              you&apos;re watching.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#options"
                className="rounded-md bg-[color:var(--accent)] px-5 py-3 text-center text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90"
              >
                Explore media
              </a>
            </div>
          </div>

          <MovieCard {...featuredMedia.movie} className="mx-auto w-full max-w-md lg:ml-auto" />
        </div>
      </section>

      <section
        id="home"
        className="border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Site Overview
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
              A shared shelf for entertainment choices.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[color:var(--muted)]">
            <p>
              A place to store media: add titles, sort them by
              format, and keep a clean path from discovery to finished.
            </p>
            <p>
              Find new media to share and recommend to friends. If you find
              something you like, add it to your own WatchList !
            </p>
          </div>
        </div>
      </section>

      <section
        id="options"
        className="border-b border-[color:var(--border)] bg-[color:var(--background)]"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Options
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
              Browse by books, shows, movies, or games.
            </h2>
          </div>

          <div className="mt-12 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
            {mediaOptions.map((option) => (
              <section
                key={option.label}
                aria-labelledby={`${option.label.toLowerCase()}-heading`}
                className="grid gap-8 py-10 lg:grid-cols-[0.8fr_1.2fr]"
              >
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">
                    {option.label}
                  </p>
                  <h3
                    id={`${option.label.toLowerCase()}-heading`}
                    className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]"
                  >
                    {option.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
                    {option.description}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {placeholderCardsByMediaType[option.label].map((card) => (
                    <MediaCardRenderer key={card.type + "-" + card.title} card={card} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section id="preferences" className="bg-[color:var(--background)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Next Steps
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
              Ready for real recommendations when the content is available.
            </h2>
          </div>
          <GameCard {...featuredMedia.game} className="mx-auto w-full max-w-md lg:ml-auto" />
        </div>
      </section>

      <button
        type="button"
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-50 rounded-full border border-[color:var(--border)] bg-[color:var(--nav-bg)] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] shadow-lg backdrop-blur-sm transition hover:bg-[color:var(--accent-soft)]"
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        aria-pressed={theme === "light"}
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
    </main>
  );
}
