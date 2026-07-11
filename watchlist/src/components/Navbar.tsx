import Link from "next/link";
import NavbarMenu from "@/components/NavbarMenu";
import NavbarSearch from "@/components/NavbarSearch";

interface NavbarProps {
  navItems?: string[];
  brandName?: string;
}

export default function Navbar({
  navItems = ["Home", "Shows", "Movies", "Books", "Games"],
  brandName = "WatchList",
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
            {navItems.map((item) =>
              item === "Home" ? (
                <Link
                  key={item}
                  href="/"
                  className="rounded px-3 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--foreground)]"
                >
                  {item}
                </Link>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-disabled="true"
                  className="cursor-default rounded px-3 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--foreground)]"
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 lg:block">
          <NavbarSearch />
        </div>

        <NavbarMenu initialUser={null} />
      </div>
    </nav>
  );
}
