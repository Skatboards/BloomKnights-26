type MediaTone = "movie" | "show" | "book" | "game";

type MetaItem = {
  label: string;
  value: string;
};

type MediaCardBaseProps = {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  href?: string;
  provider?: string;
  status?: string;
  tags?: string[];
  meta?: MetaItem[];
  className?: string;
};

export type MovieCardProps = MediaCardBaseProps & {
  runtime?: string;
  rating?: string;
  releaseYear?: string;
};

export type ShowCardProps = MediaCardBaseProps & {
  seasons?: string;
  episodeCount?: string;
  network?: string;
};

export type BookCardProps = MediaCardBaseProps & {
  author?: string;
  pageCount?: string;
  isbn?: string;
};

export type GameCardProps = MediaCardBaseProps & {
  platform?: string;
  studio?: string;
  playtime?: string;
};

const mediaStyles: Record<
  MediaTone,
  { label: string; accent: string; fallback: string }
> = {
  movie: {
    label: "Movie",
    accent: "bg-cyan-300 text-slate-950",
    fallback: "from-cyan-300 via-slate-200 to-emerald-200",
  },
  show: {
    label: "Show",
    accent: "bg-emerald-300 text-slate-950",
    fallback: "from-emerald-300 via-lime-100 to-cyan-200",
  },
  book: {
    label: "Book",
    accent: "bg-amber-200 text-stone-950",
    fallback: "from-amber-200 via-rose-100 to-cyan-100",
  },
  game: {
    label: "Game",
    accent: "bg-fuchsia-200 text-slate-950",
    fallback: "from-fuchsia-200 via-cyan-100 to-lime-200",
  },
};

function mergeMeta(...items: Array<MetaItem | undefined>) {
  return items.filter(Boolean) as MetaItem[];
}

function MediaCard({
  tone,
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  href,
  provider,
  status,
  tags = [],
  meta = [],
  className = "",
}: MediaCardBaseProps & { tone: MediaTone }) {
  const style = mediaStyles[tone];
  const cardLabel = `${style.label}: ${title}`;
  const content = (
    <article
      aria-label={cardLabel}
      className={`group grid h-full overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:bg-[color:var(--panel)] ${className}`}
    >
      <div className="aspect-[4/3] overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
        {imageUrl ? (
          <div
            role="img"
            aria-label={imageAlt || title + " artwork"}
            className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-[1.03]"
            style={{ backgroundImage: "url(" + imageUrl + ")" }}
          />
        ) : (
          <div
            className={`flex h-full w-full items-end bg-gradient-to-br ${style.fallback} p-4`}
            aria-hidden="true"
          >
            <span className="text-5xl font-semibold text-slate-950/70">
              {title.slice(0, 1)}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${style.accent}`}
          >
            {style.label}
          </span>
          {status ? (
            <span className="rounded border border-[color:var(--border)] px-2 py-1 text-xs font-medium text-[color:var(--muted-strong)]">
              {status}
            </span>
          ) : null}
          {provider ? (
            <span className="ml-auto rounded border border-[color:var(--border)] px-2 py-1 text-xs text-[color:var(--muted)]">
              {provider}
            </span>
          ) : null}
        </div>

        <div>
          <h3 className="text-xl font-semibold leading-7 text-[color:var(--foreground)]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-sm font-medium text-[color:var(--muted-strong)]">
              {subtitle}
            </p>
          ) : null}
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">
            {description}
          </p>
        </div>

        {meta.length > 0 ? (
          <dl className="grid grid-cols-2 gap-3 border-t border-[color:var(--border)] pt-4">
            {meta.map((item) => (
              <div key={`${item.label}-${item.value}`} className="min-w-0">
                <dt className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                  {item.label}
                </dt>
                <dd className="mt-1 truncate text-sm font-medium text-[color:var(--foreground)]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-2 py-1 text-xs text-[color:var(--muted-strong)]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} className="block h-full focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]">
      {content}
    </a>
  );
}

export function MovieCard({
  runtime,
  rating,
  releaseYear,
  meta = [],
  ...props
}: MovieCardProps) {
  return (
    <MediaCard
      tone="movie"
      meta={[
        ...mergeMeta(
          releaseYear ? { label: "Year", value: releaseYear } : undefined,
          runtime ? { label: "Runtime", value: runtime } : undefined,
          rating ? { label: "Rating", value: rating } : undefined,
        ),
        ...meta,
      ]}
      {...props}
    />
  );
}

export function ShowCard({
  seasons,
  episodeCount,
  network,
  meta = [],
  ...props
}: ShowCardProps) {
  return (
    <MediaCard
      tone="show"
      meta={[
        ...mergeMeta(
          seasons ? { label: "Seasons", value: seasons } : undefined,
          episodeCount ? { label: "Episodes", value: episodeCount } : undefined,
          network ? { label: "Network", value: network } : undefined,
        ),
        ...meta,
      ]}
      {...props}
    />
  );
}

export function BookCard({
  author,
  pageCount,
  isbn,
  meta = [],
  ...props
}: BookCardProps) {
  return (
    <MediaCard
      tone="book"
      subtitle={props.subtitle ?? author}
      meta={[
        ...mergeMeta(
          pageCount ? { label: "Pages", value: pageCount } : undefined,
          isbn ? { label: "ISBN", value: isbn } : undefined,
        ),
        ...meta,
      ]}
      {...props}
    />
  );
}

export function GameCard({
  platform,
  studio,
  playtime,
  meta = [],
  ...props
}: GameCardProps) {
  return (
    <MediaCard
      tone="game"
      subtitle={props.subtitle ?? studio}
      meta={[
        ...mergeMeta(
          platform ? { label: "Platform", value: platform } : undefined,
          playtime ? { label: "Playtime", value: playtime } : undefined,
        ),
        ...meta,
      ]}
      {...props}
    />
  );
}
