import type {
  BookCardProps,
  GameCardProps,
  MovieCardProps,
  ShowCardProps,
} from "@/components/MediaCards";

export type MediaType = "book" | "show" | "movie" | "game";

export type PlaceholderMediaCard =
  | ({ type: "book" } & BookCardProps)
  | ({ type: "show" } & ShowCardProps)
  | ({ type: "movie" } & MovieCardProps)
  | ({ type: "game" } & GameCardProps);

export const featuredMedia = {
  movie: {
    type: "movie",
    title: "Midnight Signal",
    subtitle: "Festival sci-fi thriller",
    description:
      "A quiet engineer follows a strange broadcast across the city and finds a story bigger than the signal itself.",
    provider: "TMDB",
    status: "Queued",
    releaseYear: "2026",
    runtime: "1h 48m",
    rating: "PG-13",
    tags: ["Sci-fi", "Mystery", "Night watch"],
  },
  show: {
    type: "show",
    title: "Archive Lane",
    subtitle: "Serialized mystery",
    description:
      "A compact series card for season tracking, network metadata, status badges, and short discovery notes.",
    provider: "OMDb",
    status: "Watching",
    seasons: "2",
    episodeCount: "16",
    network: "Streaming",
    tags: ["Drama", "Limited run", "Weekly"],
  },
  book: {
    type: "book",
    title: "The Glass Index",
    author: "Mira Sol",
    description:
      "A book card shaped for author names, ISBNs, page counts, cover art, and reading-list state.",
    provider: "Open Library",
    status: "To read",
    pageCount: "384",
    isbn: "978-0-0000",
    tags: ["Novel", "Speculative", "Library"],
  },
  game: {
    type: "game",
    title: "Circuit Bloom",
    studio: "North Tower Games",
    description:
      "A game card ready for platform, studio, playtime, screenshots, and backlog progress from game APIs.",
    provider: "IGDB / RAWG",
    status: "Backlog",
    platform: "PC",
    playtime: "18h",
    tags: ["Puzzle", "Co-op", "Indie"],
  },
} satisfies Record<MediaType, PlaceholderMediaCard>;

export const placeholderCardsByMediaType = {
  Books: [
    {
      ...featuredMedia.book,
      description:
        "A flexible book card for author names, ISBNs, page counts, cover art, and reading-list state.",
    },
    {
      type: "book",
      title: "Field Notes for Tomorrow",
      author: "Avery Chen",
      description:
        "A compact reading-list entry for nonfiction, essays, reference titles, and future cover data.",
      provider: "Google Books",
      status: "Saved",
      pageCount: "246",
      tags: ["Essays", "Research", "Reference"],
    },
  ],
  Shows: [
    {
      ...featuredMedia.show,
      description:
        "A series card for season tracking, network metadata, status badges, and short discovery notes.",
    },
    {
      type: "show",
      title: "North Campus",
      subtitle: "Campus comedy",
      description:
        "A second show slot for upcoming API-backed recommendations and episode progress.",
      provider: "TMDB",
      status: "Next up",
      seasons: "1",
      episodeCount: "8",
      tags: ["Comedy", "Comfort", "Short run"],
    },
  ],
  Movies: [
    featuredMedia.movie,
    {
      type: "movie",
      title: "Saturday Matinee",
      subtitle: "Family adventure",
      description:
        "A movie card tuned for runtime, ratings, release years, poster art, and quick watchlist decisions.",
      provider: "OMDb",
      status: "Saved",
      releaseYear: "2025",
      runtime: "1h 36m",
      rating: "PG",
      tags: ["Adventure", "Family", "Weekend"],
    },
  ],
  Games: [
    featuredMedia.game,
    {
      type: "game",
      title: "Dungeon Queue",
      studio: "Lantern Studio",
      description:
        "A second play queue card for platform filters, session planning, and future API artwork.",
      provider: "IGDB",
      status: "Playing",
      platform: "Switch",
      playtime: "42h",
      tags: ["RPG", "Party", "Campaign"],
    },
  ],
} satisfies Record<string, PlaceholderMediaCard[]>;
