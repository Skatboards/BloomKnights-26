import { createHash } from "node:crypto";

import { consumeEmailVerificationTokenByHash } from "@/lib/auth/authDb";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Verification link is invalid or expired." }, { status: 400 });
  }

  const token = typeof body === "object" && body !== null && "token" in body && typeof body.token === "string"
    ? body.token
    : "";
  if (!token || token.length > 256) {
    return Response.json({ error: "Verification link is invalid or expired." }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const userId = consumeEmailVerificationTokenByHash(tokenHash);
  if (!userId) {
    return Response.json({ error: "Verification link is invalid, expired, or already used." }, { status: 400 });
  }

  return Response.json({ message: "Your email is verified. You can now sign in." });
}
