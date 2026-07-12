"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type NavbarSearchProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (query: string) => void;
  hint?: string;
};

const suggestionDelayMs = 600;

function SuggestionSkeleton() {
  return (
    <div className="space-y-2 px-3 py-3" aria-hidden="true">
      <div className="h-4 w-3/4 rounded bg-[color:var(--panel)]" />
      <div className="h-4 w-1/2 rounded bg-[color:var(--surface)]" />
      <div className="h-4 w-2/3 rounded bg-[color:var(--panel)]" />
    </div>
  );
}

export default function NavbarSearch({
  value,
  onChange,
  onSubmit,
  hint = "Press Enter for global results.",
}: NavbarSearchProps) {
  const router = useRouter();
  const [internalQuery, setInternalQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [resolvedQuery, setResolvedQuery] = useState("");
  const searchRef = useRef<HTMLFormElement>(null);
  const query = value ?? internalQuery;
  const trimmedQuery = query.trim();
  const showSuggestions = isFocused && trimmedQuery.length > 0;
  const isLoading = showSuggestions && resolvedQuery !== trimmedQuery;
  const hasSearched = showSuggestions && resolvedQuery === trimmedQuery;

  useEffect(() => {
    if (!showSuggestions) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setResolvedQuery(trimmedQuery);
    }, suggestionDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [showSuggestions, trimmedQuery]);

  useEffect(() => {
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFocused(false);
      }
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const updateQuery = (nextQuery: string) => {
    if (onChange) {
      onChange(nextQuery);
      return;
    }

    setInternalQuery(nextQuery);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedQuery) {
      return;
    }

    setIsFocused(false);

    if (onSubmit) {
      onSubmit(trimmedQuery);
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <form ref={searchRef} className="relative" role="search" onSubmit={submitSearch}>
      <label className="sr-only" htmlFor="site-search">
        Search
      </label>
      <input
        id="site-search"
        type="search"
        value={query}
        placeholder="Search..."
        autoComplete="off"
        className="h-10 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--border-strong)] focus:ring-2 focus:ring-[color:var(--accent)]"
        onChange={(event) => updateQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
      />

      {showSuggestions ? (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--surface-strong)] text-sm shadow-xl">
          {isLoading ? (
            <SuggestionSkeleton />
          ) : hasSearched ? (
            <div className="px-3 py-3 text-[color:var(--muted)]">
              {hint}
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
