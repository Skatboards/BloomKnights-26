import type Database from "better-sqlite3";

export const version = 3;
export const name = "authjs_schema";

export function up(db: Database.Database) {
  db.exec(`
    ALTER TABLE sessions RENAME TO legacy_sessions_0003;
    ALTER TABLE email_verifications RENAME TO legacy_email_verifications_0003;
    ALTER TABLE password_resets RENAME TO legacy_password_resets_0003;
    ALTER TABLE users RENAME TO legacy_users_0003;

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

    INSERT INTO users (id, display_name, email, email_verified_at, password_hash, disabled_at, created_at, updated_at)
    SELECT 'legacy-' || id, display_name, email,
      CASE WHEN email_verified_at IS NULL THEN NULL
        ELSE CAST(strftime('%s', email_verified_at) AS INTEGER) * 1000 END,
      password_hash, disabled_at, created_at, updated_at
    FROM legacy_users_0003;

    CREATE TABLE legacy_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT NOT NULL,
      last_seen_at TEXT,
      revoked_at TEXT
    );

    INSERT INTO legacy_sessions (id, user_id, session_token_hash, created_at, expires_at, last_seen_at, revoked_at)
    SELECT id, 'legacy-' || user_id, session_token_hash, created_at, expires_at, last_seen_at, revoked_at
    FROM legacy_sessions_0003;

    CREATE INDEX idx_legacy_sessions_user_id ON legacy_sessions(user_id);
    CREATE INDEX idx_legacy_sessions_expires_at ON legacy_sessions(expires_at);

    CREATE TABLE email_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT NOT NULL,
      consumed_at TEXT
    );

    INSERT INTO email_verifications
    SELECT id, 'legacy-' || user_id, token_hash, created_at, expires_at, consumed_at
    FROM legacy_email_verifications_0003;

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

    INSERT INTO password_resets
    SELECT id, 'legacy-' || user_id, token_hash, created_at, expires_at, consumed_at
    FROM legacy_password_resets_0003;

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

    DROP TABLE legacy_sessions_0003;
    DROP TABLE legacy_email_verifications_0003;
    DROP TABLE legacy_password_resets_0003;
    DROP TABLE legacy_users_0003;
  `);
}
