export type SectionsContent = typeof import("../../sections-content.json");

export const getSectionsContent = async (): Promise<SectionsContent> => {
  const { promises: fs } = await import("fs");
  const path = (await import("path")).default;
  const filePath = path.join(process.cwd(), "sections-content.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data) as SectionsContent;
};
