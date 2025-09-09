import { fetchAllSections } from "@/lib/sections";
import type { Sections } from "@/lib/schemas";

export type SectionsContent = Sections;

export const getSectionsContent = async (): Promise<SectionsContent> => {
  const sections = await fetchAllSections();
  return sections;
};
