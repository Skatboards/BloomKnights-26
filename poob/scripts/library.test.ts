import assert from "node:assert/strict";
import argon2 from "argon2";
import { mkdtempSync, readFileSync } from "node:fs";
import { test } from "node:test";
import os from "node:os";
import path from "node:path";


import {
  credentialsSchema,
  emailSchema,
  evaluatePasswordStrength,
  getPasswordStrengthLabel,
  normalizeEmail,
  registrationSchema,
} from "../src/lib/auth/validation";
import { mediaProviders, providerLabels } from "../src/lib/media/providers";
import { createUser } from "../src/lib/auth/authDb";
import {
  consumePasswordResetToken,
  createPasswordResetRequest,
  hashPassword,
} from "../src/lib/auth/passwordReset";

import {
  checkLoginAllowed,
  recordLoginFailure,
  recordLoginSuccess,
  recordLoginVerificationError,
} from "../src/lib/auth/loginSecurity";

import { openPoobDatabase } from "../src/lib/db/bootstrap";

import { resetDatabaseForTests } from "../src/lib/db/reset";

const loginSecurityDataDir = mkdtempSync(path.join(os.tmpdir(), "poob-login-security-"));
process.env.POOB_DATA_DIR = loginSecurityDataDir;
process.env.POOB_SEED_DEMO_DATA = "false";

function freshLoginSecurityDatabase() {
  resetDatabaseForTests({ dataDir: loginSecurityDataDir, deleteFile: true });
}

function loginContext(email = "member@example.com", ipAddress = "203.0.113.10") {
  return { email, ipAddress, userAgent: "library-test" };
}

type LibraryInput = {
  case: string;
  input: string;
  expected: string;
};

function parseCsvLine(line: string) {
  return line
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((value) => value.replace(/^"|"$/g, "").replace(/""/g, '"'));
}

function loadLibraryInputs() {
  const csv = readFileSync(new URL("./fixtures/library-inputs.csv", import.meta.url), "utf8");
  const [header, ...rows] = csv.trim().split(/\r?\n/).map(parseCsvLine);

  return rows.map((row) =>
    Object.fromEntries(header.map((column, index) => [column, row[index] ?? ""])) as unknown as LibraryInput,
  );
}

const inputs = loadLibraryInputs();

function inputFor(caseName: string) {
  const input = inputs.find((candidate) => candidate.case === caseName);
  assert.ok(input, `Missing CSV input: ${caseName}`);
  return input;
}

test("emailSchema normalizes valid email addresses", () => {
  const input = inputFor("email-normalization");
  const result = emailSchema.safeParse(input.input);

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data, input.expected);
  }
});

test("emailSchema rejects malformed email addresses", () => {
  const input = inputFor("email-invalid");
  const result = emailSchema.safeParse(input.input);

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0]?.message, input.expected);
  }
});

test("normalizeEmail returns the canonical email value", () => {
  const input = inputFor("email-normalization-secondary");
  assert.equal(normalizeEmail(input.input), input.expected);
});

test("credentialsSchema validates and normalizes credentials", () => {
  const input = inputFor("credentials-valid");
  const credentials = JSON.parse(input.input) as { email: string; password: string };
  const result = credentialsSchema.safeParse({
    email: credentials.email,
    password: credentials.password,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.data, JSON.parse(input.expected));
  }
});

test("credentialsSchema rejects an empty password", () => {
  const input = inputFor("credentials-empty-password");
  const credentials = JSON.parse(input.input) as { email: string; password: string };
  const result = credentialsSchema.safeParse({
    email: credentials.email,
    password: credentials.password,
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.flatten().fieldErrors.password?.[0], input.expected);
  }
});

test("evaluatePasswordStrength returns the expected result shape", () => {
  const input = inputFor("password-strength");
  const result = evaluatePasswordStrength(input.input, ["member"]);

  assert.equal(Number.isInteger(result.score), true);
  assert.equal(result.score >= 0 && result.score <= 4, true);
  assert.equal(typeof result.crackTimeDisplay, "string");
  assert.equal(typeof result.warning, "string");
  assert.equal(Array.isArray(result.suggestions), true);
});

test("registrationSchema rejects passwords below the strong threshold", () => {
  const input = inputFor("registration-weak-password");
  const result = registrationSchema.safeParse({
    displayName: "Member",
    email: "member@example.com",
    password: input.input,
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.flatten().fieldErrors.password?.[0], input.expected);
  }
});

test("registrationSchema accepts a strong password", () => {
  const input = inputFor("registration-strong-password");
  const result = registrationSchema.safeParse({
    displayName: "Member",
    email: "member@example.com",
    password: input.input,
  });

  assert.equal(result.success, true);
});

test("getPasswordStrengthLabel maps every supported score", () => {
  for (const input of inputs.filter((candidate) => candidate.case.startsWith("password-label-"))) {
    const score = Number(input.input);
    
    assert.equal(getPasswordStrengthLabel(score), input.expected);
  }
});

test("media provider metadata exposes unique provider ids and labels", () => {
  const ids = mediaProviders.map((provider) => provider.id);

  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(providerLabels, mediaProviders.map((provider) => provider.label));
  assert.equal(mediaProviders.every((provider) => provider.cacheTtlDays > 0), true);
});

test("login security blocks an account after five failed attempts and audits the block", async () => {
  freshLoginSecurityDatabase();
  const context = loginContext();

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const result = await recordLoginFailure(context);
    assert.equal(result.blocked, false);
  }

  const blockedAttempt = await recordLoginFailure(context);
  assert.equal(blockedAttempt.blocked, true);

  const decision = await checkLoginAllowed(context);
  assert.equal(decision.allowed, false);
  assert.equal(decision.reason, "account_rate_limited");
  assert.ok((decision.retryAfterSeconds ?? 0) > 0);

  const attempts = openPoobDatabase({ dataDir: loginSecurityDataDir })
    .prepare("SELECT outcome, reason FROM login_attempts ORDER BY id")
    .all() as Array<{ outcome: string; reason: string }>;

  assert.deepEqual(attempts.map((attempt) => attempt.outcome), ["failure", "failure", "failure", "failure", "locked"]);
  assert.equal(attempts.at(-1)?.reason, "rate_limit_reached");
});

test("verification errors are audited without consuming login-failure points", async () => {
  freshLoginSecurityDatabase();
  const context = loginContext();

  recordLoginVerificationError(context);
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const result = await recordLoginFailure(context);
    assert.equal(result.blocked, false);
  }

  assert.equal((await checkLoginAllowed(context)).allowed, true);
  const attempts = openPoobDatabase({ dataDir: loginSecurityDataDir })
    .prepare("SELECT outcome, reason FROM login_attempts ORDER BY id")
    .all() as Array<{ outcome: string; reason: string }>;

  assert.equal(attempts[0]?.reason, "password_verification_error");
  assert.equal(attempts[0]?.outcome, "failure");
});

test("IP limits cover multiple accounts", async () => {
  freshLoginSecurityDatabase();

  for (let attempt = 1; attempt <= 29; attempt += 1) {
    const result = await recordLoginFailure(loginContext(`member-${attempt}@example.com`));
    assert.equal(result.blocked, false);
  }

  const blocked = await recordLoginFailure(loginContext("member-30@example.com"));
  assert.equal(blocked.blocked, true);

  const limited = await checkLoginAllowed(loginContext("member-31@example.com"));
  assert.equal(limited.allowed, false);
  assert.equal(limited.reason, "ip_rate_limited");

  await recordLoginSuccess(loginContext("member-32@example.com"));
  const stillLimited = await checkLoginAllowed(loginContext("member-33@example.com"));
  assert.equal(stillLimited.allowed, false);
  assert.equal(stillLimited.reason, "ip_rate_limited");

  const accountContext = loginContext("account-reset@example.com", "203.0.113.11");
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    await recordLoginFailure(accountContext);
  }
  await recordLoginSuccess(accountContext);
  assert.equal((await checkLoginAllowed(accountContext)).allowed, true);

  const attempts = openPoobDatabase({ dataDir: loginSecurityDataDir })
    .prepare("SELECT outcome, reason FROM login_attempts ORDER BY id")
    .all() as Array<{ outcome: string; reason: string }>;
  assert.equal(attempts.at(-1)?.outcome, "success");
});

test("password reset tokens are single-use and update the password atomically", async () => {
  freshLoginSecurityDatabase();
  const oldHash = await hashPassword("OldPassword-123!");
  const userId = createUser({
    email: "reset@example.com",
    displayName: "Reset Member",
    passwordHash: oldHash,
  });

  const reset = createPasswordResetRequest({ email: "RESET@example.com" });
  assert.ok(reset);
  assert.equal(reset.userId, userId);
  assert.equal(createPasswordResetRequest({ email: "missing@example.com" }), undefined);

  const replacement = createPasswordResetRequest({ email: "reset@example.com" });
  assert.ok(replacement);
  assert.notEqual(replacement.token, reset.token);
  assert.equal(consumePasswordResetToken(reset.token, oldHash), undefined);

  const newHash = await hashPassword("NewPassword-456!");
  const consumed = consumePasswordResetToken(replacement.token, newHash);
  assert.equal(consumed?.id, userId);
  assert.equal(consumePasswordResetToken(replacement.token, newHash), undefined);

  const row = openPoobDatabase({ dataDir: loginSecurityDataDir })
    .prepare("SELECT password_hash FROM users WHERE id = ?")
    .get(userId) as { password_hash: string };
  assert.equal(await argon2.verify(row.password_hash, "NewPassword-456!"), true);
  
  const resetCount = openPoobDatabase({ dataDir: loginSecurityDataDir })
    .prepare("SELECT COUNT(*) AS count FROM password_resets WHERE user_id = ?")
    .get(userId) as { count: number };
  assert.equal(resetCount.count, 1);
});
