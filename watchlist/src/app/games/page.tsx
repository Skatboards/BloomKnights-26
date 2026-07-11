import type { Metadata } from "next";
import MediaPage from "@/components/MediaPage";
import { placeholderCardsByMediaType } from "@/data/placeholderMedia";

export const metadata: Metadata = {
  title: "Games | WatchList",
  description: "Games saved in WatchList.",
};

export default function GamesPage() {
  return (
    <MediaPage
      activeItem="Games"
      eyebrow="Games"
      title="Play queues that stay organized."
      description="Keep campaign games, co-op nights, tabletop sessions, and casual picks visible with platform and playtime details."
      cards={placeholderCardsByMediaType.Games}
    />
  );
}
