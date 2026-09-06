"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { credentialsSchema, emailSchema } from "@/lib/auth/validation";
import Navbar from "@/components/Navbar";

type FieldName = "email" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;

function validateField(field: FieldName, value: string) {
  const result = field === "email"
    ? emailSchema.safeParse(value)
    : credentialsSchema.shape.password.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
}

export default function LoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setServerError(undefined);
  };

  const validate = () => {
    const result = credentialsSchema.safeParse(values);

    if (result.success) {
      setErrors({});
      return result.data;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if ((field === "email" || field === "password") && !nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    }
    setErrors(nextErrors);
    return undefined;
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(undefined);

    const credentials = validate();
    if (!credentials) return;

    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setServerError("The email or password is incorrect, or the account is not verified.");
      setIsSubmitting(false);
      return;
    }

    window.location.assign(result?.url ?? "/");
  };

  return (
    <>
      <Navbar activeItem="Auth" />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[color:var(--background)] px-5 py-12 text-[color:var(--foreground)]">
        <section className="w-full max-w-md">
        <p className="text-center text-base font-semibold tracking-wide text-[color:var(--foreground)]">
          WatchList
        </p>

        <div className="mt-8 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-xl sm:p-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">Welcome Back</p>
            <h1 className="mt-3 text-3xl font-semibold">Log in</h1>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              Keep your books, shows, movies, and games in one place.
            </p>
          </div>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                onBlur={() => setErrors((current) => ({ ...current, email: validateField("email", values.email) }))}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="h-11 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-3 text-sm outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                placeholder="you@example.com"
              />
              {errors.email ? <p id="email-error" className="text-sm text-red-400">{errors.email}</p> : null}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Link href="/auth/password-reset" className="text-xs text-[color:var(--accent)] hover:underline">Forgot password?</Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={values.password}
                onChange={(event) => updateField("password", event.target.value)}
                onBlur={() => setErrors((current) => ({ ...current, password: validateField("password", values.password) }))}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="h-11 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-3 text-sm outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
              />
              {errors.password ? <p id="password-error" className="text-sm text-red-400">{errors.password}</p> : null}
            </div>

            {serverError ? <p role="alert" className="text-sm text-red-400">{serverError}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-md bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
            Don&apos;t have an account? <Link href="/auth/register" className="font-medium text-[color:var(--accent)] hover:underline">Create one</Link>
          </p>
        </div>
        </section>
      </main>
    </>
  );
}
