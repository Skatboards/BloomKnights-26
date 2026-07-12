import type { Metadata } from "next";
import MediaPage from "@/components/MediaPage";
import { getMediaCardsByLabel } from "@/lib/mediaDb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Movies | WatchList",
  description: "Movies saved in WatchList.",
};

export default function MoviesPage() {
  return (
    <MediaPage
      activeItem="Movies"
      eyebrow="Movies"
      title="A watchlist for any mood."
      description="Save new releases, classics, festival picks, family nights, and late-night discoveries with runtime and rating details close at hand."
      cards={getMediaCardsByLabel("Movies")}
    />
  );
}
