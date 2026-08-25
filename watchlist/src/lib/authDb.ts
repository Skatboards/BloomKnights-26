import { openWatchlistDatabase } from "@/lib/db/bootstrap";
import { runWatchlistMigrations } from "@/lib/db/migrate";

export type NewUserInput = {
  email: string;
  displayName: string;
  passwordHash: string;
};

export type AuthSessionInput = {
  userId: number;
  sessionTokenHash: string;
  expiresAt: string;
};

export type AuthTokenInput = {
  userId: number;
  tokenHash: string;
  expiresAt: string;
};

export type AuthUserRow = {
  id: number;
  email: string;
  display_name: string;
  password_hash: string;
  email_verified_at: string | null;
  disabled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthSessionRow = {
  id: number;
  user_id: number;
  session_token_hash: string;
  created_at: string;
  expires_at: string;
  last_seen_at: string | null;
  revoked_at: string | null;
};

let initialized = false;

function getDb() {
  const db = openWatchlistDatabase();

  if (!initialized) {
    initialized = true;
    runWatchlistMigrations(db);
  }

  return db;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createUser(input: NewUserInput) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO users (email, display_name, password_hash)
    VALUES (?, ?, ?)
  `).run(normalizeEmail(input.email), input.displayName.trim(), input.passwordHash);

  return Number(result.lastInsertRowid);
}

export function findUserByEmail(email: string) {
  const db = getDb();
  return db.prepare(`
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
  `).get(normalizeEmail(email)) as AuthUserRow | undefined;
}

export function findUserById(userId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT *
    FROM users
    WHERE id = ?
    LIMIT 1
  `).get(userId) as AuthUserRow | undefined;
}

export function createSession(input: AuthSessionInput) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO sessions (user_id, session_token_hash, expires_at)
    VALUES (?, ?, ?)
  `).run(input.userId, input.sessionTokenHash, input.expiresAt);

  return Number(result.lastInsertRowid);
}

export function findSessionByTokenHash(tokenHash: string) {
  const db = getDb();
  return db.prepare(`
    SELECT *
    FROM sessions
    WHERE session_token_hash = ?
    LIMIT 1
  `).get(tokenHash) as AuthSessionRow | undefined;
}

export function revokeSessionByTokenHash(tokenHash: string) {
  const db = getDb();

  return db.prepare(`
    UPDATE sessions
    SET revoked_at = CURRENT_TIMESTAMP
    WHERE session_token_hash = ? AND revoked_at IS NULL
  `).run(tokenHash);
}

export function createEmailVerificationToken(input: AuthTokenInput) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO email_verifications (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
  `).run(input.userId, input.tokenHash, input.expiresAt);

  return Number(result.lastInsertRowid);
}

export function consumeEmailVerificationTokenByHash(tokenHash: string) {
  const db = getDb();

  return db.transaction(() => {
    const verification = db.prepare(`
      SELECT *
      FROM email_verifications
      WHERE token_hash = ?
      LIMIT 1
    `).get(tokenHash) as { id: number; user_id: number; consumed_at: string | null; expires_at: string } | undefined;

    if (!verification || verification.consumed_at) {
      return undefined;
    }

    db.prepare(`
      UPDATE email_verifications
      SET consumed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(verification.id);

    db.prepare(`
      UPDATE users
      SET email_verified_at = COALESCE(email_verified_at, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(verification.user_id);

    return verification.user_id;
  })();
}

export function createPasswordResetToken(input: AuthTokenInput) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO password_resets (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
  `).run(input.userId, input.tokenHash, input.expiresAt);

  return Number(result.lastInsertRowid);
}

export function resetAuthDbForTests() {
  initialized = false;
}
