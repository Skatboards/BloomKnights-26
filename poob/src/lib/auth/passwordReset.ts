import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";

import { findUserByEmail } from "@/lib/auth/authDb";
import { openPoobDatabase } from "@/lib/db/bootstrap";
import { runPoobMigrations } from "@/lib/db/migrate";

const DEFAULT_TOKEN_LIFETIME_MS = 60 * 60 * 1000;

export type PasswordResetRequest = {
  email: string;
  expiresInMs?: number;
};

export type PasswordResetToken = {
  userId: string;
  email: string;
  token: string;
  expiresAt: string;
};

let initialized = false;

function getDb() {
  const db = openPoobDatabase();
  if (!initialized) {
    runPoobMigrations(db);
    initialized = true;
  }
  return db;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a single-use reset token for an existing account.
 * Returns undefined for unknown accounts so callers can use a generic response.
 */
export function createPasswordResetRequest(input: PasswordResetRequest): PasswordResetToken | undefined {
  const user = findUserByEmail(input.email);
  if (!user || user.disabled_at) {
    return undefined;
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + (input.expiresInMs ?? DEFAULT_TOKEN_LIFETIME_MS)).toISOString();
  const db = getDb();

  db.transaction(() => {
    db.prepare("DELETE FROM password_resets WHERE user_id = ? AND consumed_at IS NULL").run(user.id);
    db.prepare(`
      INSERT INTO password_resets (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `).run(user.id, hashToken(token), expiresAt);
  })();

  return { userId: user.id, email: user.email, token, expiresAt };
}

/**
 * Consumes a valid reset token and updates the password atomically.
 * The caller must validate and hash the new password before calling this function.
 */
export function consumePasswordResetToken(token: string, passwordHash: string) {
  if (!token || token.length > 256 || !passwordHash) {
    return undefined;
  }

  const db = getDb();
  return db.transaction(() => {
    const reset = db.prepare(`
      SELECT id, user_id, expires_at, consumed_at
      FROM password_resets
      WHERE token_hash = ?
      LIMIT 1
    `).get(hashToken(token)) as {
      id: number;
      user_id: string;
      expires_at: string;
      consumed_at: string | null;
    } | undefined;

    if (!reset || reset.consumed_at || new Date(reset.expires_at).getTime() <= Date.now()) {
      return undefined;
    }

    const user = db.prepare("SELECT id, email FROM users WHERE id = ? LIMIT 1").get(reset.user_id) as {
      id: string;
      email: string;
    } | undefined;
    
    if (!user) {
      return undefined;
    }

    db.prepare(`
      UPDATE users
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(passwordHash, user.id);
    db.prepare("UPDATE password_resets SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?").run(reset.id);
    db.prepare("DELETE FROM password_resets WHERE user_id = ? AND id != ?").run(user.id, reset.id);

    return user;
  })();
}

/** Hashes a new password using the same Argon2 implementation as sign-in. */
export function hashPassword(password: string) {
  return argon2.hash(password);
}

/** @internal Used by resetDatabaseForTests. */
export function resetPasswordResetStateForTests() {
  initialized = false;
}
