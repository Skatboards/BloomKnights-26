"use client";

import { useSyncExternalStore } from "react";

const navItems = ["Overview", "Workspace", "Activity", "Settings"];

const stats = [
  { label: "Active projects", value: "24" },
  { label: "Open tasks", value: "138" },
  { label: "Team members", value: "16" },
];

const features = [
  "Unified dashboard",
  "Shared timelines",
  "Priority tracking",
  "Insight reports",
  "Role controls",
  "Fast search",
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
      <nav className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--nav-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-5 sm:px-8 lg:px-10">
          <div className="flex shrink-0 items-center gap-6">
            <a
              href="#top"
              className="shrink-0 rounded-md px-3 py-2 text-base font-semibold tracking-wide text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
            >
              WatchList
            </a>
            <div className="hidden items-center gap-1 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] p-1 md:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="rounded px-3 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--foreground)]"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden min-w-0 flex-1 lg:block">
            <label className="sr-only" htmlFor="site-search">
              Search
            </label>
            <input
              id="site-search"
              type="search"
              placeholder="Search..."
              className="h-10 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:bg-[color:var(--accent-soft)]"
            />
          </div>
          <a
            href="#overview"
            className="ml-auto shrink-0 rounded-md bg-[color:var(--foreground)] px-4 py-2 text-sm font-medium text-[color:var(--background)] transition hover:bg-[color:var(--accent)]"
          >
            Launch
          </a>
        </div>
      </nav>

      <section id="top" className="border-b border-[color:var(--border)] bg-[color:var(--background)]">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-[color:var(--accent)]">
              Operations Console
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-6xl lg:text-7xl">
              A calm command center for everyday work.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              Track priorities, surface activity, and keep moving through a
              focused interface designed for a general-purpose web app.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#workspace"
                className="rounded-md bg-[color:var(--accent)] px-5 py-3 text-center text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90"
              >
                View workspace
              </a>
              <a
                href="#activity"
                className="rounded-md border border-[color:var(--border-strong)] px-5 py-3 text-center text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
              >
                Recent activity
              </a>
            </div>
          </div>

          <div className="grid gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-2xl shadow-black/25">
            <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium text-[color:var(--muted)]">
                  Today
                </span>
                <span className="rounded bg-[color:var(--live-bg)] px-2 py-1 text-xs font-medium text-[color:var(--live-fg)]">
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {[72, 46, 88, 64].map((width, index) => (
                  <div key={width} className="rounded-md bg-[color:var(--surface)] p-3">
                    <div className="mb-3 h-2 w-24 rounded bg-[color:var(--panel)]" />
                    <div
                      className="h-2 rounded"
                      style={{ width: `${width}%`, backgroundColor: "var(--accent)" }}
                    />
                    <p className="mt-3 text-sm text-[color:var(--muted)]">Queue {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4"
                >
                  <p className="text-2xl font-semibold text-[color:var(--foreground)]">{stat.value}</p>
                  <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Overview
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
                Everything important stays in view.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
                >
                  <div className="mb-6 h-8 w-8 rounded bg-[color:var(--accent-soft)]" />
                  <h3 className="font-medium text-[color:var(--foreground)]">{feature}</h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                    Flexible placeholder content for a polished application front page.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workspace" className="border-b border-[color:var(--border)] bg-[color:var(--background)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-3 lg:px-10">
          <div className="lg:col-span-1">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Workspace
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[color:var(--foreground)]">
              Built for scrolling, scanning, and focus.
            </h2>
          </div>
          <div className="space-y-4 lg:col-span-2">
            {["Planning", "Execution", "Review"].map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-medium text-[color:var(--foreground)]">{item}</h3>
                  <span className="text-sm text-[color:var(--muted)]">0{item.length}</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="h-24 rounded bg-[color:var(--surface-strong)]" />
                  <div className="h-24 rounded bg-[color:var(--surface-strong)]" />
                  <div className="h-24 rounded bg-[color:var(--surface-strong)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="activity" className="border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">Activity</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["New update", "Team note", "System event"].map((item) => (
              <article
                key={item}
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--background)] p-6"
              >
                <p className="text-sm text-[color:var(--accent)]">Just now</p>
                <h3 className="mt-3 text-xl font-semibold text-[color:var(--foreground)]">{item}</h3>
                <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                  A compact feed item that keeps the front page feeling active without adding another route.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="settings" className="bg-[color:var(--background)]">
        <div className="mx-auto flex min-h-96 w-full max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">Settings</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
            A simple final band keeps the page continuous and ready to expand.
          </h2>
        </div>
      </section>

      <button
        type="button"
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-50 rounded-full border border-[color:var(--border)] bg-[color:var(--nav-bg)] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] shadow-lg backdrop-blur-xl transition hover:bg-[color:var(--surface)]"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={theme === "light"}
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
    </main>
  );
}
