import Link from "next/link";

import Navbar from "@/components/Navbar";

export default function VerifyPage() {
  return (
    <>
      <Navbar activeItem="Auth" />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[color:var(--background)] px-5 py-12 text-[color:var(--foreground)]">
        <section className="w-full max-w-md">
          <p className="text-center text-base font-semibold tracking-wide text-[color:var(--foreground)]">WatchList</p>
          <div className="mt-8 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-center shadow-xl sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">Almost there</p>
            <h1 className="mt-3 text-3xl font-semibold">Check your email</h1>
            <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
              Your account was created. Follow the verification link in your email before signing in.
            </p>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              If you do not see it, check your spam folder or try again later.
            </p>
            <Link href="/auth" className="mt-8 inline-block rounded-md bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90">
              Return to sign in
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
