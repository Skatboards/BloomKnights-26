import type { Metadata } from "next";
import MediaPage from "@/components/MediaPage";
import { placeholderCardsByMediaType } from "@/data/placeholderMedia";

export const metadata: Metadata = {
  title: "Books | WatchList",
  description: "Books saved in WatchList.",
};

export default function BooksPage() {
  return (
    <MediaPage
      activeItem="Books"
      eyebrow="Books"
      title="Reading lists for every pace."
      description="Collect novels, essays, graphic novels, reference titles, and rereads with author, page count, and list status details."
      cards={placeholderCardsByMediaType.Books}
    />
  );
}
