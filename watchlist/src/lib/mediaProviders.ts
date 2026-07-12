export type MediaProvider = {
  id: string;
  label: string;
  mediaTypes: Array<"book" | "show" | "movie" | "game">;
  cacheTtlDays: number;
  notes: string;
};

export const mediaProviders = [
  {
    id: "tmdb",
    label: "TMDb",
    mediaTypes: ["show", "movie"],
    cacheTtlDays: 7,
    notes: "Primary movie and show metadata provider, following the Jellyfin-style provider model.",
  },
  {
    id: "omdb",
    label: "OMDb",
    mediaTypes: ["show", "movie"],
    cacheTtlDays: 14,
    notes: "Supplemental movie and show metadata provider for IMDb-oriented fields.",
  },
  {
    id: "open-library",
    label: "Open Library",
    mediaTypes: ["book"],
    cacheTtlDays: 30,
    notes: "Primary open book metadata provider.",
  },
  {
    id: "google-books",
    label: "Google Books",
    mediaTypes: ["book"],
    cacheTtlDays: 30,
    notes: "Supplemental book metadata and cover lookup provider.",
  },
  {
    id: "igdb",
    label: "IGDB",
    mediaTypes: ["game"],
    cacheTtlDays: 14,
    notes: "Primary video game metadata provider; must be called server-side with Twitch credentials.",
  },
] satisfies MediaProvider[];

export const providerLabels = mediaProviders.map((provider) => provider.label);
