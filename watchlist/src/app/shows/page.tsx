import type { Metadata } from "next";
import MediaPage from "@/components/MediaPage";
import { getMediaCardsByLabel } from "@/lib/mediaDb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shows | WatchList",
  description: "Shows saved in WatchList.",
};

export default function ShowsPage() {
  return (
    <MediaPage
      activeItem="Shows"
      eyebrow="Shows"
      title="Series worth returning to."
      description="Track limited series, long-running favorites, anime, documentaries, and comfort watches in a focused card layout."
      cards={getMediaCardsByLabel("Shows")}
    />
  );
}
