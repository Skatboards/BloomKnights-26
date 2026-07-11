import React from "react";

interface NavbarProps {
  navItems?: string[];
  brandName?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function Navbar({
  navItems = ["Overview", "Workspace", "Activity", "Settings"],
  brandName = "WatchList",
  ctaText = "Launch",
  ctaHref = "#overview",
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--nav-bg)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-5 sm:px-8 lg:px-10">
        <div className="flex shrink-0 items-center gap-6">
          <a
            href="#top"
            className="shrink-0 rounded-md px-3 py-2 text-base font-semibold tracking-wide text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
          >
            {brandName}
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
            className="h-10 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)]"
          />
        </div>

        <a
          href={ctaHref}
          className="ml-auto shrink-0 rounded-md bg-[color:var(--foreground)] px-4 py-2 text-sm font-medium text-[color:var(--background)] transition hover:bg-[color:var(--accent)]"
        >
          {ctaText}
        </a>
      </div>
    </nav>
  );
}
