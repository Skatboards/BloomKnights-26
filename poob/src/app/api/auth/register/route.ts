import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";

import { createEmailVerificationToken, createUser, deleteUser, findUserByEmail } from "@/lib/auth/authDb";
import { sendVerificationEmail } from "@/lib/auth/email";
import { registrationSchema } from "@/lib/auth/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Enter valid registration details." }, { status: 400 });
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Enter valid registration details." }, { status: 400 });
  }

  const existingUser = findUserByEmail(parsed.data.email);
  if (existingUser) {
    return Response.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await argon2.hash(parsed.data.password);
  const userId = createUser({
    email: parsed.data.email,
    displayName: parsed.data.displayName,
    passwordHash,
  });

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  createEmailVerificationToken({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  try {
    await sendVerificationEmail(parsed.data.email, token);
  } catch (error) {
    deleteUser(userId);
    console.error("Could not send account verification email: ", error);
    return Response.json({ error: "We could not send a verification email. Please try again later." }, { status: 503 });
  }

  return Response.json({
    message: "Account created. Check your email for a verification link.",
  }, { status: 201 });
}
