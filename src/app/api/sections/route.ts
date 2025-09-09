import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const filePath = path.join(projectRoot, "sections-content.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(fileContents);
    return NextResponse.json(json, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load sections content" },
      { status: 500 }
    );
  }
}
