import { createHash } from "node:crypto";
import { RateLimiterSQLite, type RateLimiterRes } from "rate-limiter-flexible";

import { openPoobDatabase } from "@/lib/db/bootstrap";
import { runPoobMigrations } from "@/lib/db/migrate";

const ACCOUNT_LIMIT = 5;
const IP_LIMIT = 30;
const WINDOW_SECONDS = 15 * 60;
const BLOCK_SECONDS = 15 * 60;

export type LoginAttemptContext = {
  email: string;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type LoginDecision = {
  allowed: boolean;
  reason?: "account_rate_limited" | "ip_rate_limited";
  retryAfterSeconds?: number;
};

let initialized = false;
let accountLimiter: RateLimiterSQLite | null = null;
let ipLimiter: RateLimiterSQLite | null = null;

function getDatabase() {
  const db = openPoobDatabase();
  if (!initialized) {
    runPoobMigrations(db);

    accountLimiter = new RateLimiterSQLite({
      storeClient: db,
      storeType: "better-sqlite3",
      tableName: "login_rate_limits_account",
      tableCreated: true,
      points: ACCOUNT_LIMIT,
      duration: WINDOW_SECONDS,
      blockDuration: BLOCK_SECONDS,
    });
    ipLimiter = new RateLimiterSQLite({
      storeClient: db,
      storeType: "better-sqlite3",
      tableName: "login_rate_limits_ip",
      tableCreated: true,
      points: IP_LIMIT,
      duration: WINDOW_SECONDS,
      blockDuration: BLOCK_SECONDS,
    });
    initialized = true;
  }
  return db;
}

function hashIdentifier(email: string) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

function normalizeIp(ipAddress?: string | null) {
  return ipAddress?.trim() || "unknown";
}

function retryAfterSeconds(result: RateLimiterRes) {
  return Math.max(1, Math.ceil(result.msBeforeNext / 1000));
}

function rejectedDecision(reason: LoginDecision["reason"], result: RateLimiterRes): LoginDecision {
  return { allowed: false, reason, retryAfterSeconds: retryAfterSeconds(result) };
}

export async function checkLoginAllowed(context: LoginAttemptContext): Promise<LoginDecision> {
  getDatabase();

  const accountKey = `account:${hashIdentifier(context.email)}`;
  const ipKey = `ip:${normalizeIp(context.ipAddress)}`;

  const accountState = await accountLimiter!.get(accountKey);
  if (accountState && accountState.remainingPoints <= 0) {
    return rejectedDecision("account_rate_limited", accountState);
  }

  const ipState = await ipLimiter!.get(ipKey);
  if (ipState && ipState.remainingPoints <= 0) {
    return rejectedDecision("ip_rate_limited", ipState);
  }

  return { allowed: true };
}

/** Records invalid credential logins, Consumes login tokens for limiter */
export async function recordLoginFailure(
  context: LoginAttemptContext,
  reason: string = "invalid_credentials",
) {
  getDatabase();

  const accountKey = `account:${hashIdentifier(context.email)}`;
  const ipKey = `ip:${normalizeIp(context.ipAddress)}`;

  let accountResult: RateLimiterRes | undefined;
  let ipResult: RateLimiterRes | undefined;

  try {
    accountResult = await accountLimiter!.consume(accountKey);
  } catch (result) {
    accountResult = result as RateLimiterRes;
  }

  try {
    ipResult = await ipLimiter!.consume(ipKey);
  } catch (result) {
    ipResult = result as RateLimiterRes;
  }

  const blocked = (accountResult?.remainingPoints ?? 1) <= 0 || (ipResult?.remainingPoints ?? 1) <= 0;

  writeLoginAttempt(context, blocked ? "locked" : "failure", blocked ? "rate_limit_reached" : reason);
  return {
    blocked,
    retryAfterSeconds: blocked
      ? Math.max(retryAfterSeconds(accountResult ?? ipResult!), retryAfterSeconds(ipResult ?? accountResult!))
      : undefined,
  };
}

/** Records excess login attempts after being limited */
export function recordLoginRateLimited(context: LoginAttemptContext, reason: string) {
  writeLoginAttempt(context, "rate_limited", reason);
}

/** Records server-side verification problem, does not consume tokens for limiting */
export function recordLoginVerificationError(context: LoginAttemptContext) {
  writeLoginAttempt(context, "failure", "password_verification_error");
}

/** Records successful logins and resets */
export async function recordLoginSuccess(context: LoginAttemptContext) {
  getDatabase();
  await accountLimiter!.delete(`account:${hashIdentifier(context.email)}`);
  writeLoginAttempt(context, "success", "authenticated");
}

/** Responsible for all login writes to db */
function writeLoginAttempt(
  context: LoginAttemptContext,
  outcome: "success" | "failure" | "rate_limited" | "locked",
  reason: string,
) {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO login_attempts
      (user_id, identifier_hash, outcome, reason, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    context.userId ?? null,
    hashIdentifier(context.email),
    outcome,
    reason,
    context.ipAddress?.trim() || null,
    context.userAgent?.slice(0, 512) || null,
  );
}

/** @internal Used by resetDatabaseForTests. */
export function resetLoginSecurityStateForTests() {
  initialized = false;
  accountLimiter = null;
  ipLimiter = null;
}
