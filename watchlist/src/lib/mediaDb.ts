import Database from "better-sqlite3";
import { placeholderCardsByMediaType, type PlaceholderMediaCard } from "@/data/placeholderMedia";
import {
  openWatchlistDatabase,
  resetWatchlistDatabaseForTests,
  shouldSeedDemoData,
} from "@/lib/db/bootstrap";
import { runWatchlistMigrations } from "@/lib/db/migrate";

type MediaType = "book" | "show" | "movie" | "game";

type MediaItemRow = {
  id: number;
  media_type: MediaType;
  title: string;
  subtitle: string | null;
  description: string;
  provider: string | null;
  status: string | null;
  image_url: string | null;
  image_alt: string | null;
  runtime: string | null;
  rating: string | null;
  release_year: string | null;
  seasons: string | null;
  episode_count: string | null;
  network: string | null;
  author: string | null;
  page_count: string | null;
  isbn: string | null;
  platform: string | null;
  studio: string | null;
  playtime: string | null;
  tags_json: string | null;
  meta_json: string | null;
};

export type MediaItemInput = {
  type: MediaType;
  title: string;
  subtitle?: string;
  description: string;
  provider?: string;
  status?: string;
  imageUrl?: string;
  imageAlt?: string;
  runtime?: string;
  rating?: string;
  releaseYear?: string;
  seasons?: string;
  episodeCount?: string;
  network?: string;
  author?: string;
  pageCount?: string;
  isbn?: string;
  platform?: string;
  studio?: string;
  playtime?: string;
  tags?: string[];
};

const mediaTypeByLabel = {
  Books: "book",
  Shows: "show",
  Movies: "movie",
  Games: "game",
} satisfies Record<string, MediaType>;

let initialized = false;

function getDb() {
  const db = openWatchlistDatabase();

  if (!initialized) {
    initialized = true;
    runWatchlistMigrations(db);

    if (shouldSeedDemoData()) {
      seedPlaceholderMedia(db);
    }
  }

  return db;
}

function seedPlaceholderMedia(db: Database.Database) {
  const row = db.prepare("SELECT COUNT(*) AS count FROM media_items").get() as { count: number };

  if (row.count > 0) {
    return;
  }

  for (const cards of Object.values(placeholderCardsByMediaType)) {
    for (const card of cards) {
      insertMediaItem(db, cardToMediaItemInput(card as PlaceholderMediaCard));
    }
  }
}

function cardToMediaItemInput(card: PlaceholderMediaCard): MediaItemInput {
  const base = {
    type: card.type,
    title: card.title,
    subtitle: card.subtitle,
    description: card.description,
    provider: card.provider,
    status: card.status,
    imageUrl: card.imageUrl,
    imageAlt: card.imageAlt,
    tags: card.tags,
  };

  if (card.type === "book") {
    return {
      ...base,
      author: card.author,
      pageCount: card.pageCount,
      isbn: card.isbn,
    };
  }

  if (card.type === "show") {
    return {
      ...base,
      seasons: card.seasons,
      episodeCount: card.episodeCount,
      network: card.network,
    };
  }

  if (card.type === "movie") {
    return {
      ...base,
      runtime: card.runtime,
      rating: card.rating,
      releaseYear: card.releaseYear,
    };
  }

  return {
    ...base,
    platform: card.platform,
    studio: card.studio,
    playtime: card.playtime,
  };
}

function optionalValue(value: FormDataEntryValue | string | undefined | null) {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
}

function insertMediaItem(db: Database.Database, item: MediaItemInput) {
  const insert = db.transaction((nextItem: MediaItemInput) => {
    const result = db.prepare(`
      INSERT INTO media_items (
        media_type, title, subtitle, description, provider, status, image_url, image_alt,
        runtime, rating, release_year, seasons, episode_count, network, author, page_count,
        isbn, platform, studio, playtime, tags_json, meta_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      nextItem.type,
      nextItem.title,
      optionalValue(nextItem.subtitle) ?? null,
      nextItem.description,
      optionalValue(nextItem.provider) ?? null,
      optionalValue(nextItem.status) ?? "Saved",
      optionalValue(nextItem.imageUrl) ?? null,
      optionalValue(nextItem.imageAlt) ?? null,
      optionalValue(nextItem.runtime) ?? null,
      optionalValue(nextItem.rating) ?? null,
      optionalValue(nextItem.releaseYear) ?? null,
      optionalValue(nextItem.seasons) ?? null,
      optionalValue(nextItem.episodeCount) ?? null,
      optionalValue(nextItem.network) ?? null,
      optionalValue(nextItem.author) ?? null,
      optionalValue(nextItem.pageCount) ?? null,
      optionalValue(nextItem.isbn) ?? null,
      optionalValue(nextItem.platform) ?? null,
      optionalValue(nextItem.studio) ?? null,
      optionalValue(nextItem.playtime) ?? null,
      JSON.stringify(nextItem.tags ?? []),
      JSON.stringify([]),
    );

    const mediaItemId = Number(result.lastInsertRowid);
    db.prepare("INSERT OR IGNORE INTO list_entries (media_item_id, list_status) VALUES (?, ?)")
      .run(mediaItemId, optionalValue(nextItem.status)?.toLowerCase() ?? "saved");

    if (nextItem.provider) {
      db.prepare(`
        INSERT OR IGNORE INTO provider_cache (provider, external_id, media_type, payload_json, expires_at)
        VALUES (?, ?, ?, ?, datetime('now', '+7 days'))
      `).run(nextItem.provider, `local-${mediaItemId}`, nextItem.type, JSON.stringify(nextItem));
    }

    return mediaItemId;
  });

  return insert(item);
}

function parseJsonArray(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rowToCard(row: MediaItemRow): PlaceholderMediaCard {
  const common = {
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    description: row.description,
    provider: row.provider ?? undefined,
    status: row.status ?? undefined,
    imageUrl: row.image_url ?? undefined,
    imageAlt: row.image_alt ?? undefined,
    tags: parseJsonArray(row.tags_json) as string[],
    meta: parseJsonArray(row.meta_json) as Array<{ label: string; value: string }>,
  };

  if (row.media_type === "book") {
    return {
      ...common,
      type: "book",
      author: row.author ?? undefined,
      pageCount: row.page_count ?? undefined,
      isbn: row.isbn ?? undefined,
    };
  }

  if (row.media_type === "show") {
    return {
      ...common,
      type: "show",
      seasons: row.seasons ?? undefined,
      episodeCount: row.episode_count ?? undefined,
      network: row.network ?? undefined,
    };
  }

  if (row.media_type === "movie") {
    return {
      ...common,
      type: "movie",
      runtime: row.runtime ?? undefined,
      rating: row.rating ?? undefined,
      releaseYear: row.release_year ?? undefined,
    };
  }

  return {
    ...common,
    type: "game",
    platform: row.platform ?? undefined,
    studio: row.studio ?? undefined,
    playtime: row.playtime ?? undefined,
  };
}

export function getMediaCardsByLabel(label: keyof typeof mediaTypeByLabel) {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM media_items
    WHERE media_type = ?
    ORDER BY created_at DESC, id DESC
  `).all(mediaTypeByLabel[label]) as MediaItemRow[];

  return rows.map(rowToCard);
}

export function getAllMediaCards() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM media_items ORDER BY created_at DESC, id DESC").all() as MediaItemRow[];
  return rows.map(rowToCard);
}

export function createManualMediaItem(formData: FormData) {
  const mediaType = optionalValue(formData.get("type")) as MediaType | undefined;
  const title = optionalValue(formData.get("title"));

  if (!mediaType || !["book", "show", "movie", "game"].includes(mediaType)) {
    throw new Error("Choose a valid media type.");
  }

  if (!title) {
    throw new Error("Title is required.");
  }

  const tags = optionalValue(formData.get("tags"))
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];

  return insertMediaItem(getDb(), {
    type: mediaType,
    title,
    subtitle: optionalValue(formData.get("subtitle")),
    description: optionalValue(formData.get("description")) ?? "Manual watchlist entry.",
    provider: optionalValue(formData.get("provider")) ?? "Manual",
    status: optionalValue(formData.get("status")) ?? "Saved",
    imageUrl: optionalValue(formData.get("imageUrl")),
    imageAlt: optionalValue(formData.get("imageAlt")),
    runtime: optionalValue(formData.get("runtime")),
    rating: optionalValue(formData.get("rating")),
    releaseYear: optionalValue(formData.get("releaseYear")),
    seasons: optionalValue(formData.get("seasons")),
    episodeCount: optionalValue(formData.get("episodeCount")),
    network: optionalValue(formData.get("network")),
    author: optionalValue(formData.get("author")),
    pageCount: optionalValue(formData.get("pageCount")),
    isbn: optionalValue(formData.get("isbn")),
    platform: optionalValue(formData.get("platform")),
    studio: optionalValue(formData.get("studio")),
    playtime: optionalValue(formData.get("playtime")),
    tags,
  });
}

export function resetMediaDbForTests() {
  initialized = false;
  resetWatchlistDatabaseForTests();
}
