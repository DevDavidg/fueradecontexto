import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { SectionsSchema, type Sections } from "@/lib/schemas";

const tableName = "sections";

export type SectionsRow = {
  id: string;
  slug: string; // e.g., 'inicio', 'productos', 'checkout'
  content: unknown; // JSONB
  updated_at: string | null;
};

export const fetchAllSections = async (): Promise<Sections> => {
  const { data, error } = await supabaseServer
    .from<SectionsRow>(tableName)
    .select("slug, content");
  if (error) throw new Error(error.message);

  const merged: Record<string, unknown> = {};
  for (const row of data ?? []) {
    merged[row.slug] = row.content ?? {};
  }

  const parsed = SectionsSchema.safeParse(merged);
  if (!parsed.success) {
    throw new Error(
      `Sections validation failed: ${JSON.stringify(parsed.error.format())}`
    );
  }
  return parsed.data;
};

export const fetchSectionBySlug = async <T = unknown>(slug: string) => {
  const { data, error } = await supabaseServer
    .from<SectionsRow>(tableName)
    .select("content")
    .eq("slug", slug)
    .single();
  if (error) throw new Error(error.message);
  return data?.content as T;
};

export type SectionsContent = typeof import("../../sections-content.json");

export const fetchSectionsContent = async (): Promise<SectionsContent> => {
  const res = await fetch("/api/sections", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch sections content");
  }
  return (await res.json()) as SectionsContent;
};
