"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

type NavbarMenuProps = {
  initialUser?: { name?: string } | null;
};

const themeStorageKey = "watchlist-theme";

function getStoredTheme(): Theme {
  const activeTheme = document.documentElement.dataset.theme;
  if (activeTheme === "light" || activeTheme === "dark") {
    return activeTheme;
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(themeStorageKey, theme);

  const themeColor = document.querySelector("meta[name=\"theme-color\"]");
  if (themeColor) {
    themeColor.setAttribute(
      "content",
      theme === "dark" ? "#121722" : "#f7f8fa",
    );
  }
}

export default function NavbarMenu({ initialUser = null }: NavbarMenuProps) {
  const isSignedIn = Boolean(initialUser);
  const authHref = isSignedIn ? "/account" : "/auth";
  const authLabel = isSignedIn ? "Account" : "Login / Sign up";
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const menuRef = useRef<HTMLDivElement>(null);
  const nextTheme = theme === "dark" ? "light" : "dark";
  const isLightTheme = theme === "light";

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const toggleTheme = () => {
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <div ref={menuRef} className="relative ml-auto shrink-0">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="sr-only">Menu</span>
        <span className="flex w-4 flex-col gap-1" aria-hidden="true">
          <span className="h-0.5 rounded-full bg-current" />
          <span className="h-0.5 rounded-full bg-current" />
          <span className="h-0.5 rounded-full bg-current" />
        </span>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--surface-strong)] py-2 text-sm shadow-xl"
          role="menu"
        >
          <a
            href={authHref}
            className="block px-4 py-2 font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            {authLabel}
          </a>
          <div
            className="flex items-center justify-between gap-4 px-4 py-2 text-[color:var(--foreground)]"
            role="menuitem"
          >
            <span className="font-medium">Theme</span>
            <button
              type="button"
              className={`relative h-6 w-11 rounded-full border border-[color:var(--border)] transition focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] ${
                isLightTheme
                  ? "bg-[color:var(--accent)]"
                  : "bg-[color:var(--surface)]"
              }`}
              role="switch"
              aria-checked={isLightTheme}
              aria-label={`Switch to ${nextTheme} mode`}
              onClick={toggleTheme}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-[color:var(--accent-foreground)] transition ${
                  isLightTheme ? "left-5" : "left-0.5"
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
          <button
            type="button"
            className="block w-full px-4 py-2 text-left font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </button>
        </div>
      ) : null}
    </div>
  );
}
