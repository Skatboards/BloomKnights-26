import Navbar from "@/components/Navbar";
import VerifyEmail from "@/components/VerifyEmail";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <>
      <Navbar activeItem="Auth" />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[color:var(--background)] px-5 py-12 text-[color:var(--foreground)]">
        <section className="w-full max-w-md">
          <p className="text-center text-base font-semibold tracking-wide text-[color:var(--foreground)]">Poob</p>
          <div className="mt-8 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-center shadow-xl sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">Almost there</p>
            <h1 className="mt-3 text-3xl font-semibold">Verify your email</h1>
            <VerifyEmail token={token ?? ""} />
          </div>
        </section>
      </main>
    </>
  );
}
