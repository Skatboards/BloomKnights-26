import { createPasswordResetRequest } from "@/lib/auth/passwordReset";
import { sendPasswordResetEmail } from "@/lib/auth/email";
import { emailSchema } from "@/lib/auth/validation";

export const runtime = "nodejs";

const genericResponse = {
  message: "If an account uses that email address, a password reset link has been sent.",
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(genericResponse);
  }

  const email = typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
    ? emailSchema.safeParse(body.email)
    : undefined;

  if (!email?.success) {
    return Response.json(genericResponse);
  }

  const reset = createPasswordResetRequest({ email: email.data });
  if (reset) {
    try {
      await sendPasswordResetEmail(reset.email, reset.token);
    } catch (error) {
      console.error("Could not send password reset email:", error);
    }
  }

  return Response.json(genericResponse);
}
