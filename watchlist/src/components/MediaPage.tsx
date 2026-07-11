import Navbar from "@/components/Navbar";
import { BookCard, GameCard, MovieCard, ShowCard } from "@/components/MediaCards";
import type { PlaceholderMediaCard } from "@/data/placeholderMedia";

const navItems = ["Home", "Shows", "Movies", "Books", "Games"];

type MediaPageProps = {
  activeItem: "Shows" | "Movies" | "Books" | "Games";
  eyebrow: string;
  title: string;
  description: string;
  cards: PlaceholderMediaCard[];
};

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

export default function MediaPage({
  activeItem,
  eyebrow,
  title,
  description,
  cards,
}: MediaPageProps) {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Navbar navItems={navItems} activeItem={activeItem} />

      <section
        id="top"
        className="border-b border-[color:var(--border)] bg-[color:var(--background)]"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">
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
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => (
              <MediaCardRenderer key={`${card.type}-${card.title}`} card={card} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
