import { NextResponse } from "next/server";
import { fetchAllSections } from "@/lib/sections";

export async function GET() {
  try {
    const sections = await fetchAllSections();
    return NextResponse.json(sections, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to load sections content", error: `${err}` },
      { status: 500 }
    );
  }
}
