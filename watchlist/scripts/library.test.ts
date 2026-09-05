import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  credentialsSchema,
  emailSchema,
  normalizeEmail,
} from "../src/lib/auth/validation";
import {
  evaluatePasswordStrength,
  getPasswordStrengthLabel,
} from "../src/lib/auth/passwordStrength";
import { mediaProviders, providerLabels } from "../src/lib/media/providers";

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
