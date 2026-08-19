import type Database from "better-sqlite3";

export const version = 1;
export const name = "initial_schema";

export function up(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      media_type TEXT NOT NULL CHECK (media_type IN ('book', 'show', 'movie', 'game')),
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT NOT NULL DEFAULT '',
      provider TEXT,
      status TEXT,
      image_url TEXT,
      image_alt TEXT,
      runtime TEXT,
      rating TEXT,
      release_year TEXT,
      seasons TEXT,
      episode_count TEXT,
      network TEXT,
      author TEXT,
      page_count TEXT,
      isbn TEXT,
      platform TEXT,
      studio TEXT,
      playtime TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      meta_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS media_sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      media_item_id INTEGER NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      external_id TEXT NOT NULL,
      source_url TEXT,
      raw_payload_json TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(provider, external_id)
    );

    CREATE TABLE IF NOT EXISTS provider_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      external_id TEXT NOT NULL,
      media_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      fetched_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT,
      UNIQUE(provider, external_id)
    );

    CREATE TABLE IF NOT EXISTS list_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      media_item_id INTEGER NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
      list_name TEXT NOT NULL DEFAULT 'default',
      list_status TEXT NOT NULL DEFAULT 'saved',
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(media_item_id, list_name)
    );

    CREATE TABLE IF NOT EXISTS media_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      media_item_id INTEGER NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
      image_kind TEXT NOT NULL DEFAULT 'cover',
      remote_url TEXT,
      local_path TEXT,
      width INTEGER,
      height INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_media_items_type_title ON media_items(media_type, title);
    CREATE INDEX IF NOT EXISTS idx_media_items_provider ON media_items(provider);
    CREATE INDEX IF NOT EXISTS idx_list_entries_status ON list_entries(list_status);
  `);
}
