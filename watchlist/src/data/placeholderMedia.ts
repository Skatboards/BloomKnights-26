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
    {
      type: "book",
      title: "Lantern Atlas",
      author: "Nadia Reyes",
      description:
        "A travel fantasy pick with map notes, reread status, and library-friendly metadata.",
      provider: "Open Library",
      status: "Reading",
      pageCount: "512",
      isbn: "978-1-2345",
      tags: ["Fantasy", "Maps", "Series"],
    },
    {
      type: "book",
      title: "Quiet Systems",
      author: "Jon Bell",
      description:
        "A systems-thinking nonfiction slot for technical recommendations and saved research.",
      provider: "Google Books",
      status: "To read",
      pageCount: "328",
      tags: ["Nonfiction", "Technology", "Work"],
    },
    {
      type: "book",
      title: "Paper Moons",
      author: "Elena Hart",
      description:
        "A short story collection card for literary picks, finished status, and author discovery.",
      provider: "Open Library",
      status: "Finished",
      pageCount: "204",
      tags: ["Stories", "Literary", "Short"],
    },
    {
      type: "book",
      title: "The Orchard Machine",
      author: "Samir Vale",
      description:
        "A speculative mystery title for tracking genre, page count, and recommendation sources.",
      provider: "Google Books",
      status: "Saved",
      pageCount: "416",
      tags: ["Mystery", "Speculative", "Queue"],
    },
    {
      type: "book",
      title: "Designing the Long Weekend",
      author: "Priya Shah",
      description:
        "A practical design and planning book for reference shelves and future API notes.",
      provider: "Google Books",
      status: "To read",
      pageCount: "272",
      tags: ["Design", "Planning", "Reference"],
    },
    {
      type: "book",
      title: "Blue Room Almanac",
      author: "Theo Marsh",
      description:
        "A graphic novel placeholder with room for cover art, edition data, and reading progress.",
      provider: "Open Library",
      status: "Saved",
      pageCount: "188",
      tags: ["Graphic novel", "Art", "Weekend"],
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
      network: "Streaming",
      tags: ["Comedy", "Comfort", "Short run"],
    },
    {
      type: "show",
      title: "Signal House",
      subtitle: "Tech documentary",
      description:
        "A documentary series placeholder for source, episode count, and watch progress.",
      provider: "TMDB",
      status: "Saved",
      seasons: "1",
      episodeCount: "6",
      network: "Public TV",
      tags: ["Documentary", "Technology", "Weekly"],
    },
    {
      type: "show",
      title: "Harbor Lights",
      subtitle: "Coastal drama",
      description:
        "A serialized drama with room for network metadata and next-episode reminders.",
      provider: "OMDb",
      status: "Watching",
      seasons: "3",
      episodeCount: "30",
      network: "Cable",
      tags: ["Drama", "Family", "Ongoing"],
    },
    {
      type: "show",
      title: "Pixel Kitchen",
      subtitle: "Food competition",
      description:
        "A light reality series entry for casual watching and shared recommendation lists.",
      provider: "TMDB",
      status: "Saved",
      seasons: "2",
      episodeCount: "20",
      network: "Streaming",
      tags: ["Food", "Reality", "Casual"],
    },
    {
      type: "show",
      title: "Moonbase Dispatch",
      subtitle: "Animated sci-fi",
      description:
        "An animated series card with genre tags, season totals, and provider data.",
      provider: "TMDB",
      status: "Next up",
      seasons: "4",
      episodeCount: "44",
      network: "Streaming",
      tags: ["Animation", "Sci-fi", "Comedy"],
    },
    {
      type: "show",
      title: "The Index Room",
      subtitle: "Archive thriller",
      description:
        "A limited thriller series for tracking short-run status and mystery recommendations.",
      provider: "OMDb",
      status: "Finished",
      seasons: "1",
      episodeCount: "7",
      network: "Premium",
      tags: ["Thriller", "Mystery", "Limited"],
    },
    {
      type: "show",
      title: "Saturday Build",
      subtitle: "Maker series",
      description:
        "A weekend maker show placeholder for future episode artwork and search data.",
      provider: "TMDB",
      status: "Saved",
      seasons: "2",
      episodeCount: "18",
      network: "Web",
      tags: ["Maker", "Learning", "Weekend"],
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
    {
      type: "movie",
      title: "Low Tide Neon",
      subtitle: "Coastal noir",
      description:
        "A moody mystery placeholder with release year, runtime, and provider metadata.",
      provider: "TMDB",
      status: "Watching",
      releaseYear: "2024",
      runtime: "2h 04m",
      rating: "R",
      tags: ["Noir", "Mystery", "Drama"],
    },
    {
      type: "movie",
      title: "The Picnic Equation",
      subtitle: "Romantic comedy",
      description:
        "A light comedy entry for date-night filters, ratings, and saved recommendations.",
      provider: "OMDb",
      status: "Saved",
      releaseYear: "2023",
      runtime: "1h 42m",
      rating: "PG-13",
      tags: ["Comedy", "Romance", "Light"],
    },
    {
      type: "movie",
      title: "Archive Sun",
      subtitle: "Historical drama",
      description:
        "A historical film placeholder for release year search and long-form watch planning.",
      provider: "TMDB",
      status: "To watch",
      releaseYear: "2022",
      runtime: "2h 18m",
      rating: "PG-13",
      tags: ["History", "Drama", "Awards"],
    },
    {
      type: "movie",
      title: "Orbit & Oak",
      subtitle: "Animated feature",
      description:
        "An animated feature for family watchlists, provider filters, and genre browsing.",
      provider: "OMDb",
      status: "Saved",
      releaseYear: "2026",
      runtime: "1h 31m",
      rating: "PG",
      tags: ["Animation", "Family", "Sci-fi"],
    },
    {
      type: "movie",
      title: "Night Market Radio",
      subtitle: "Music documentary",
      description:
        "A documentary card for music recommendations, runtime details, and source tracking.",
      provider: "TMDB",
      status: "Finished",
      releaseYear: "2021",
      runtime: "1h 58m",
      rating: "PG-13",
      tags: ["Documentary", "Music", "Night watch"],
    },
    {
      type: "movie",
      title: "Cloudbreak Station",
      subtitle: "Disaster thriller",
      description:
        "A high-energy thriller placeholder for quick watch decisions and rating filters.",
      provider: "OMDb",
      status: "To watch",
      releaseYear: "2020",
      runtime: "1h 49m",
      rating: "PG-13",
      tags: ["Thriller", "Action", "Storm"],
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
    {
      type: "game",
      title: "Meadow Circuit",
      studio: "Bright Arc",
      description:
        "A cozy racing game placeholder for platform search, short sessions, and backlog status.",
      provider: "RAWG",
      status: "Saved",
      platform: "PC",
      playtime: "8h",
      tags: ["Racing", "Cozy", "Indie"],
    },
    {
      type: "game",
      title: "Skyline Tactics",
      studio: "Grid Forge",
      description:
        "A tactics game card for playtime estimates, studio metadata, and platform filters.",
      provider: "IGDB",
      status: "Backlog",
      platform: "PlayStation",
      playtime: "35h",
      tags: ["Strategy", "Tactics", "Campaign"],
    },
    {
      type: "game",
      title: "Pocket Observatory",
      studio: "Small Moon",
      description:
        "A casual discovery game entry for short play sessions and future screenshot data.",
      provider: "RAWG",
      status: "Playing",
      platform: "Mobile",
      playtime: "5h",
      tags: ["Casual", "Space", "Puzzle"],
    },
    {
      type: "game",
      title: "Iron Orchard",
      studio: "North Tower Games",
      description:
        "An action adventure placeholder with studio, platform, and completion-time metadata.",
      provider: "IGDB",
      status: "To play",
      platform: "Xbox",
      playtime: "24h",
      tags: ["Action", "Adventure", "Co-op"],
    },
    {
      type: "game",
      title: "Recipe Runner",
      studio: "Pantry Pixel",
      description:
        "A couch co-op game card for party-night planning and local multiplayer filters.",
      provider: "RAWG",
      status: "Saved",
      platform: "Switch",
      playtime: "12h",
      tags: ["Co-op", "Party", "Cooking"],
    },
    {
      type: "game",
      title: "Archive Diver",
      studio: "Deep Shelf",
      description:
        "A narrative exploration game placeholder for backlog progress and story tags.",
      provider: "IGDB",
      status: "Finished",
      platform: "PC",
      playtime: "16h",
      tags: ["Narrative", "Exploration", "Mystery"],
    },
  ],
} satisfies Record<string, PlaceholderMediaCard[]>;

export const allPlaceholderMediaCards = Object.values(placeholderCardsByMediaType).flat();
