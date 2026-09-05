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

    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      display_name TEXT,
      email TEXT NOT NULL UNIQUE,
      email_verified_at INTEGER,
      image TEXT,
      password_hash TEXT,
      disabled_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE email_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT NOT NULL,
      consumed_at TEXT
    );

    CREATE INDEX idx_email_verifications_user_id ON email_verifications(user_id);
    CREATE INDEX idx_email_verifications_expires_at ON email_verifications(expires_at);

    CREATE TABLE password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT NOT NULL,
      consumed_at TEXT
    );

    CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
    CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);

    CREATE TABLE account (
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      providerAccountId TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      PRIMARY KEY (provider, providerAccountId)
    );

    CREATE TABLE session (
      sessionToken TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires INTEGER NOT NULL
    );

    CREATE TABLE verificationToken (
      identifier TEXT NOT NULL,
      token TEXT NOT NULL,
      expires INTEGER NOT NULL,
      PRIMARY KEY (identifier, token)
    );

    CREATE TABLE authenticator (
      credentialID TEXT NOT NULL UNIQUE,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      providerAccountId TEXT NOT NULL,
      credentialPublicKey TEXT NOT NULL,
      counter INTEGER NOT NULL,
      credentialDeviceType TEXT NOT NULL,
      credentialBackedUp INTEGER NOT NULL,
      transports TEXT,
      PRIMARY KEY (userId, credentialID)
    );
  `);
}
