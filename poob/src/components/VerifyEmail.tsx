"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type State = "verifying" | "success" | "error";

export default function VerifyEmail({ token }: { token: string }) {
  const [state, setState] = useState<State>(token ? "verifying" : "error");
  const [message, setMessage] = useState(token ? "Verifying your email address…" : "This verification link is invalid or expired.");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    void fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async (response) => {
      const result = await response.json() as { message?: string; error?: string };
      if (cancelled) return;
      setState(response.ok ? "success" : "error");
      setMessage(result.message ?? result.error ?? "Email verification failed.");
    }).catch(() => {
      if (cancelled) return;
      setState("error");
      setMessage("We could not verify your email. Please try again.");
    });

    return () => { cancelled = true; };
  }, [token]);

  return (
    <>
      <p className={`mt-4 text-sm leading-6 ${state === "error" ? "text-red-600" : "text-[color:var(--muted)]"}`} role="status" aria-live="polite">
        {message}
      </p>
      {state === "error" && (
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          If you just created an account, check your spam folder or register again for a new link.
        </p>
      )}
      {state !== "verifying" && (
        <Link href="/auth" className="mt-8 inline-block rounded-md bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90">
          {state === "success" ? "Sign in" : "Return to sign in"}
        </Link>
      )}
    </>
  );
}
