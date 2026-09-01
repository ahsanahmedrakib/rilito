import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/models";
import { readSettings } from "@/lib/db/seed";

export async function GET() {
  try {
    await connectDb();
    const settings = await readSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("[settings GET]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
