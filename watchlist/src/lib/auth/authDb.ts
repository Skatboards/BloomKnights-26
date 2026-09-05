import { openWatchlistDatabase } from "@/lib/db/bootstrap";
import { runWatchlistMigrations } from "@/lib/db/migrate";
import { normalizeEmail } from "@/lib/auth/validation";

export { normalizeEmail } from "@/lib/auth/validation";

export type NewUserInput = {
  email: string;
  displayName: string;
  passwordHash: string;
};

export type AuthTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: string;
};

export type AuthUserRow = {
  id: string;
  email: string;
  display_name: string | null;
  password_hash: string | null;
  email_verified_at: number | null;
  disabled_at: string | null;
  created_at: string;
  updated_at: string;
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

export function createUser(input: NewUserInput) {
  const db = getDb();
  const userId = crypto.randomUUID();
  db.prepare(`
    INSERT INTO users (id, email, display_name, password_hash)
    VALUES (?, ?, ?, ?)
  `).run(userId, normalizeEmail(input.email), input.displayName.trim(), input.passwordHash);

  return userId;
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

export function findUserById(userId: string) {
  const db = getDb();
  return db.prepare(`
    SELECT *
    FROM users
    WHERE id = ?
    LIMIT 1
  `).get(userId) as AuthUserRow | undefined;
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
    `).get(tokenHash) as { id: number; user_id: string; consumed_at: string | null; expires_at: string } | undefined;

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
      SET email_verified_at = COALESCE(email_verified_at, unixepoch('now') * 1000), updated_at = CURRENT_TIMESTAMP
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

/** @internal Used by resetDatabaseForTests. */
export function resetAuthDatabaseStateForTests() {
  initialized = false;
}
