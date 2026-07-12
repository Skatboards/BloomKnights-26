"use server";

import { redirect } from "next/navigation";
import { createManualMediaItem } from "@/lib/mediaDb";

const routeByType = {
  book: "/books",
  show: "/shows",
  movie: "/movies",
  game: "/games",
} as const;

export async function addMediaItemAction(formData: FormData) {
  createManualMediaItem(formData);

  const type = String(formData.get("type") ?? "");
  redirect(routeByType[type as keyof typeof routeByType] ?? "/");
}
