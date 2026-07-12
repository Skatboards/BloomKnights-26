import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { addMediaItemAction } from "@/app/add/actions";
import { providerLabels } from "@/lib/mediaProviders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const navItems = ["Home", "Shows", "Movies", "Books", "Games", "Add"];

export const metadata: Metadata = {
  title: "Add Media | WatchList",
  description: "Add a local media item to WatchList.",
};

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--border-strong)] focus:ring-2 focus:ring-[color:var(--accent)]";
const textareaClass =
  "mt-2 min-h-28 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--border-strong)] focus:ring-2 focus:ring-[color:var(--accent)]";
const labelClass = "text-sm font-medium text-[color:var(--foreground)]";

export default function AddMediaPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Navbar navItems={navItems} activeItem="Add" searchHint="Press Enter for global results." />

      <section className="border-b border-[color:var(--border)] bg-[color:var(--background)]">
        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[color:var(--accent)]">
              Add to list
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-5xl">
              Add a local media item.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
              This form writes directly to the local SQLite database. Provider-backed search can later fill the same fields from TMDb, Open Library, Google Books, OMDb, or IGDB.
            </p>
          </div>

          <form
            action={addMediaItemAction}
            className="mt-10 grid gap-8 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Media type
                <select name="type" required defaultValue="movie" className={inputClass}>
                  <option value="book">Book</option>
                  <option value="show">Show</option>
                  <option value="movie">Movie</option>
                  <option value="game">Game</option>
                </select>
              </label>

              <label className={labelClass}>
                Status
                <select name="status" defaultValue="Saved" className={inputClass}>
                  <option>Saved</option>
                  <option>Watching</option>
                  <option>Reading</option>
                  <option>Playing</option>
                  <option>Next up</option>
                  <option>Backlog</option>
                  <option>Finished</option>
                  <option>To watch</option>
                  <option>To read</option>
                  <option>To play</option>
                </select>
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Title
                <input name="title" required placeholder="Midnight Signal" className={inputClass} />
              </label>

              <label className={labelClass}>
                Subtitle
                <input name="subtitle" placeholder="Festival sci-fi thriller" className={inputClass} />
              </label>
            </div>

            <label className={labelClass}>
              Description
              <textarea name="description" placeholder="Short summary or notes for this list entry." className={textareaClass} />
            </label>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className={labelClass}>
                Provider
                <input name="provider" list="provider-options" placeholder="Manual, TMDb, IGDB" className={inputClass} />
                <datalist id="provider-options">
                  <option value="Manual" />
                  {providerLabels.map((provider) => (
                    <option key={provider} value={provider} />
                  ))}
                </datalist>
              </label>
              <label className={labelClass}>
                Tags
                <input name="tags" placeholder="Sci-fi, Co-op, Weekend" className={inputClass} />
              </label>
              <label className={labelClass}>
                Image URL
                <input name="imageUrl" type="url" placeholder="https://..." className={inputClass} />
              </label>
            </div>

            <div className="grid gap-5 border-t border-[color:var(--border)] pt-6 sm:grid-cols-3">
              <label className={labelClass}>
                Movie runtime
                <input name="runtime" placeholder="1h 48m" className={inputClass} />
              </label>
              <label className={labelClass}>
                Movie rating
                <input name="rating" placeholder="PG-13" className={inputClass} />
              </label>
              <label className={labelClass}>
                Movie year
                <input name="releaseYear" placeholder="2026" className={inputClass} />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className={labelClass}>
                Show seasons
                <input name="seasons" placeholder="2" className={inputClass} />
              </label>
              <label className={labelClass}>
                Show episodes
                <input name="episodeCount" placeholder="16" className={inputClass} />
              </label>
              <label className={labelClass}>
                Show network
                <input name="network" placeholder="Streaming" className={inputClass} />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className={labelClass}>
                Book author
                <input name="author" placeholder="Mira Sol" className={inputClass} />
              </label>
              <label className={labelClass}>
                Book pages
                <input name="pageCount" placeholder="384" className={inputClass} />
              </label>
              <label className={labelClass}>
                Book ISBN
                <input name="isbn" placeholder="978-0-0000" className={inputClass} />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className={labelClass}>
                Game platform
                <input name="platform" placeholder="PC" className={inputClass} />
              </label>
              <label className={labelClass}>
                Game studio
                <input name="studio" placeholder="North Tower Games" className={inputClass} />
              </label>
              <label className={labelClass}>
                Game playtime
                <input name="playtime" placeholder="18h" className={inputClass} />
              </label>
            </div>

            <div className="flex justify-end border-t border-[color:var(--border)] pt-6">
              <button
                type="submit"
                className="rounded-md bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90"
              >
                Add media
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
