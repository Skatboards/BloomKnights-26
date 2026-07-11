import type { Metadata } from "next";
import MediaPage from "@/components/MediaPage";
import { placeholderCardsByMediaType } from "@/data/placeholderMedia";

export const metadata: Metadata = {
  title: "Shows | WatchList",
  description: "Series and shows saved in WatchList.",
};

export default function ShowsPage() {
  return (
    <MediaPage
      activeItem="Shows"
      eyebrow="Shows"
      title="Series worth returning to."
      description="Track limited series, long-running favorites, anime, documentaries, and comfort watches in a focused card layout."
      cards={placeholderCardsByMediaType.Shows}
    />
  );
}
