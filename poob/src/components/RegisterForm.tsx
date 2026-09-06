"use client";

import Link from "next/link";
import { useState } from "react";

import Navbar from "@/components/Navbar";
import { emailSchema, evaluatePasswordStrength, getPasswordStrengthLabel, registrationFormSchema } from "@/lib/auth/validation";

type FieldName = "displayName" | "email" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;

function validateField(field: FieldName, value: string) {
  const schema = field === "displayName"
    ? registrationFormSchema.shape.displayName
    : field === "email"
      ? emailSchema
      : registrationFormSchema.shape.password;
  const result = schema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
}

export default function RegisterForm() {
  const [values, setValues] = useState({ displayName: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = values.password
    ? evaluatePasswordStrength(values.password, [values.displayName, values.email])
    : undefined;
  const strengthLabel = passwordStrength
    ? getPasswordStrengthLabel(passwordStrength.score)
    : undefined;
  const strengthWidths = ["w-0", "w-1/4", "w-2/4", "w-3/4", "w-full"];
  const strengthColors = [
    "bg-red-500",
    "bg-red-500",
    "bg-yellow-400",
    "bg-lime-400",
    "bg-green-400",
  ];

  const updateField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setServerError(undefined);
  };

  const validate = () => {
    const result = registrationFormSchema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if ((field === "displayName" || field === "email" || field === "password") && !nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    }
    setErrors(nextErrors);
    return undefined;
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(undefined);

    const registration = validate();
    if (!registration) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration),
      });
      const result = await response.json() as { error?: string };

      if (!response.ok) {
        setServerError(result.error ?? "Unable to create your account.");
      } else {
        window.location.assign(`/auth/verify?email=${encodeURIComponent(registration.email)}`);
      }
    } catch {
      setServerError("Unable to create your account. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar activeItem="Auth" />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[color:var(--background)] px-5 py-12 text-[color:var(--foreground)]">
        <section className="w-full max-w-md">
          <p className="text-center text-base font-semibold tracking-wide text-[color:var(--foreground)]">Poob</p>
          <div className="mt-8 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-xl sm:p-8">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">Get started</p>
              <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">Build a personal place for everything you want to read, watch, and play.</p>
            </div>

            <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-2">
                <label htmlFor="displayName" className="text-sm font-medium">Display Name</label>
                <input id="displayName" name="displayName" type="text" autoComplete="name" value={values.displayName} onChange={(event) => updateField("displayName", event.target.value)} onBlur={() => setErrors((current) => ({ ...current, displayName: validateField("displayName", values.displayName) }))} aria-invalid={Boolean(errors.displayName)} aria-describedby={errors.displayName ? "displayName-error" : undefined} className="h-11 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-3 text-sm outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]" />
                {errors.displayName ? <p id="displayName-error" className="text-sm text-red-400">{errors.displayName}</p> : null}
              </div>

              <div className="grid gap-2">
                <label htmlFor="register-email" className="text-sm font-medium">Email</label>
                <input id="register-email" name="email" type="email" autoComplete="email" value={values.email} onChange={(event) => updateField("email", event.target.value)} onBlur={() => setErrors((current) => ({ ...current, email: validateField("email", values.email) }))} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} className="h-11 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-3 text-sm outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]" placeholder="you@example.com" />
                {errors.email ? <p id="register-email-error" className="text-sm text-red-400">{errors.email}</p> : null}
              </div>

              <div className="grid gap-2">
                <label htmlFor="register-password" className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={values.password} onChange={(event) => updateField("password", event.target.value)} onBlur={() => setErrors((current) => ({ ...current, password: validateField("password", values.password) }))} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "register-password-error password-strength" : "password-strength"} className="h-11 w-full rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-3 pr-20 text-sm outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-3 select-none text-xs font-medium text-[color:var(--muted)] [-webkit-tap-highlight-color:transparent] hover:text-[color:var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
                </div>
                {errors.password ? <p id="register-password-error" className="text-sm text-red-400">{errors.password}</p> : null}
                <div id="password-strength" aria-live="polite" className="grid gap-2">
                  <div className="flex h-1.5 gap-1" aria-hidden="true">
                    {strengthWidths.slice(1).map((width, index) => (
                      <span key={width} className={`h-full flex-1 rounded-full ${passwordStrength && passwordStrength.score >= index + 1 ? strengthColors[passwordStrength.score] : "bg-[color:var(--panel)]"}`} />
                    ))}
                  </div>
                  {strengthLabel ? <p className="text-xs text-[color:var(--muted)]">Password strength: <span className="font-medium text-[color:var(--foreground)]">{strengthLabel}</span>{passwordStrength?.warning ? ` — ${passwordStrength.warning}` : ""}</p> : <p className="text-xs text-[color:var(--muted)]">Use at least 8 characters.</p>}
                </div>
              </div>

              {serverError ? <p role="alert" className="text-sm text-red-400">{serverError}</p> : null}
              <button type="submit" disabled={isSubmitting} className="h-11 rounded-md bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Creating account…" : "Create account"}</button>
            </form>

            <p className="mt-6 text-center text-sm text-[color:var(--muted)]">Already have an account? <Link href="/auth" className="font-medium text-[color:var(--accent)] hover:underline">Sign in</Link></p>
          </div>
        </section>
      </main>
    </>
  );
}
