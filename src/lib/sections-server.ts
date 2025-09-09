export type SectionsContent = typeof import("../../sections-content.json");
import { SectionsSchema } from "@/lib/schemas";

export const getSectionsContent = async (): Promise<SectionsContent> => {
  const { promises: fs } = await import("fs");
  const path = (await import("path")).default;
  const filePath = path.join(process.cwd(), "sections-content.json");
  const data = await fs.readFile(filePath, "utf-8");
  const json = JSON.parse(data);
  const parsed = SectionsSchema.safeParse(json);
  if (!parsed.success) {
    console.error("Sections content validation failed", parsed.error.flatten());
    // fallback: return raw json to avoid breaking, but keep type as any
    return json as SectionsContent;
  }
  return parsed.data as unknown as SectionsContent;
};
