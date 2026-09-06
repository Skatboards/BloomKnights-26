import argon2 from "argon2";

import { createUser, findUserByEmail } from "@/lib/auth/authDb";
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
  createUser({
    email: parsed.data.email,
    displayName: parsed.data.displayName,
    passwordHash,
  });

  return Response.json({
    message: "Account created. Email verification delivery is not configured yet.",
  }, { status: 201 });
}
