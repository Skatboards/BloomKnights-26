import { consumePasswordResetToken, hashPassword } from "@/lib/auth/passwordReset";
import { passwordResetFormSchema } from "@/lib/auth/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Password reset link is invalid or expired." }, { status: 400 });
  }

  const token = typeof body === "object" && body !== null && "token" in body && typeof body.token === "string"
    ? body.token
    : "";
  const parsed = passwordResetFormSchema.safeParse(body);

  if (!token || token.length > 256 || !parsed.success) {
    return Response.json({ error: parsed.success ? "Password reset link is invalid or expired." : parsed.error.issues[0]?.message }, { status: 400 });
  }

  const user = consumePasswordResetToken(token, await hashPassword(parsed.data.password));
  if (!user) {
    return Response.json({ error: "Password reset link is invalid, expired, or already used." }, { status: 400 });
  }

  return Response.json({ message: "Your password has been reset. You can now sign in." });
}
