import Link from "next/link";
import NavbarMenu from "@/components/NavbarMenu";
import NavbarSearch from "@/components/NavbarSearch";

interface NavbarProps {
  navItems?: string[];
  brandName?: string;
  activeItem?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (query: string) => void;
  searchHint?: string;
}

export default function Navbar({
  navItems = ["Home", "Shows", "Movies", "Books", "Games"],
  brandName = "WatchList",
  activeItem = "Home",
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchHint,
}: NavbarProps) {
  const navHrefs: Record<string, string> = {
    Home: "/",
    Shows: "/shows",
    Movies: "/movies",
    Books: "/books",
    Games: "/games",
  };
  const activeNavClass =
    "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]";
  const inactiveNavClass =
    "text-[color:var(--muted)] hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]";

  return (
    <nav className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--nav-bg)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-5 sm:px-8 lg:px-10">
        <div className="flex shrink-0 items-center gap-6">
          <Link
            href="/"
            className="shrink-0 cursor-pointer rounded-md px-3 py-2 text-base font-semibold tracking-wide text-[color:var(--foreground)] transition hover:bg-[color:var(--accent)]"
          >
            {brandName}
          </Link>

          <div className="hidden items-center gap-1 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] p-1 md:flex">
            {navItems.map((item) => {
              const isActive = item === activeItem;
              const navClassName = `cursor-pointer rounded px-3 py-2 text-sm transition ${
                isActive ? activeNavClass : inactiveNavClass
              }`;
              const href = navHrefs[item] ?? "/";

              return (
                <Link
                  key={item}
                  href={href}
                  className={navClassName}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 lg:block">
          <NavbarSearch
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
            hint={searchHint}
          />
        </div>

        <NavbarMenu initialUser={null} />
      </div>
    </nav>
  );
}
