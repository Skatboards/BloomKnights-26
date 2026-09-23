"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { emailSchema, evaluatePasswordStrength, getPasswordStrengthLabel, passwordResetFormSchema, validateEmail } from "@/lib/auth/validation";

type FieldName = "email" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldName, string>>;

const strengthColors = ["bg-red-500", "bg-red-500", "bg-yellow-400", "bg-lime-400", "bg-green-400"];

function PasswordStrength({ password }: { password: string }) {
  const strength = password ? evaluatePasswordStrength(password) : undefined;
  const label = strength ? getPasswordStrengthLabel(strength.score) : undefined;

  return (
    <div id="reset-password-strength" aria-live="polite" className="grid gap-2">
      <div className="flex h-1.5 gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((level) => (
          <span key={level} className={`h-full flex-1 rounded-full ${strength && strength.score >= level ? strengthColors[strength.score] : "bg-[color:var(--panel)]"}`} />
        ))}
      </div>
      {label ? (
        <p className="text-xs text-[color:var(--muted)]">
          Password strength: <span className="font-medium text-[color:var(--foreground)]">{label}</span>
          {strength?.warning ? ` — ${strength.warning}` : ""}
          {strength && strength.score < 3 ? " — Choose a strong or very strong password." : ""}
        </p>
      ) : (
        <p className="text-xs text-[color:var(--muted)]">
          Use at least 8 characters and choose a strong or very strong password.
        </p>
      )}
    </div>
  );
}

export default function PasswordResetForm({ token }: { token: string }) {
  const mode: "request" | "reset" = token ? "reset" : "request";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) window.history.replaceState(null, "", "/auth/password-reset");
  }, [token]);

  const submitRequest = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(undefined);
    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      setErrors({ email: parsedEmail.error.issues[0]?.message });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsedEmail.data }),
      });
      const result = await response.json() as { message?: string };
      setMessage(result.message ?? "If an account uses that email address, a password reset link has been sent.");
    } catch {
      setServerError("We could not process your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReset = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(undefined);
    const parsed = passwordResetFormSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if ((field === "password" || field === "confirmPassword") && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/password-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password, confirmPassword }) });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) setServerError(result.error ?? "Password reset link is invalid or expired.");
      else setMessage(result.message ?? "Your password has been reset. You can now sign in.");
    } catch {
      setServerError("We could not reset your password. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (message) {
    return (
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">All set</p>
        <h1 className="mt-3 text-3xl font-semibold">{mode === "request" ? "Check your email" : "Password reset"}</h1>
        <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]" role="status" aria-live="polite">
          {message}
        </p>
        <Link href="/auth" className="mt-8 inline-block rounded-md bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90">
          Sign in
        </Link>
      </div>
    );
  }

  if (mode === "request") {
    return (
      <>
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">Account access</p>
          <h1 className="mt-3 text-3xl font-semibold">Reset your password</h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            Enter your email and we&apos;ll send a reset link if an account is registered.
          </p>
        </div>

        <form className="mt-8 grid gap-5" onSubmit={submitRequest} noValidate>
          <div className="grid gap-2">
            <label htmlFor="reset-email" className="text-sm font-medium">Email</label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setErrors((current) => ({ ...current, email: validateEmail(email) }))}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "reset-email-error" : undefined}
              className="h-11 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-3 text-sm outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
              placeholder="you@example.com"
            />
            {errors.email ? <p id="reset-email-error" className="text-sm text-red-400">{errors.email}</p> : null}
          </div>

          {serverError ? <p role="alert" className="text-sm text-red-400">{serverError}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-md bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
          <Link href="/auth" className="font-medium text-[color:var(--accent)] hover:underline">Return to sign in</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">Account access</p>
        <h1 className="mt-3 text-3xl font-semibold">Choose a new password</h1>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          Use a strong password you haven&apos;t used here before.
        </p>
      </div>

      <form className="mt-8 grid gap-5" onSubmit={submitReset} noValidate>
        <div className="grid gap-2">
          <label htmlFor="reset-password" className="text-sm font-medium">New password</label>
          <div className="relative">
            <input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "reset-password-error reset-password-strength" : "reset-password-strength"}
              className="h-11 w-full rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-3 pr-20 text-sm outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-3 select-none text-xs font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password ? <p id="reset-password-error" className="text-sm text-red-400">{errors.password}</p> : null}
          <PasswordStrength password={password} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="reset-confirm-password" className="text-sm font-medium">Confirm new password</label>
          <input
            id="reset-confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "reset-confirm-password-error" : undefined}
            className="h-11 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-3 text-sm outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
          />
          {errors.confirmPassword ? <p id="reset-confirm-password-error" className="text-sm text-red-400">{errors.confirmPassword}</p> : null}
        </div>

        {serverError ? <p role="alert" className="text-sm text-red-400">{serverError}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-md bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Resetting…" : "Reset password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
        <Link href="/auth" className="font-medium text-[color:var(--accent)] hover:underline">Return to sign in</Link>
      </p>
    </>
  );
}
