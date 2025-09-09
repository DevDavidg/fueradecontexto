export type SectionsContent = typeof import("../../sections-content.json");

export const fetchSectionsContent = async (): Promise<SectionsContent> => {
  const res = await fetch("/api/sections", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch sections content");
  }
  return (await res.json()) as SectionsContent;
};
