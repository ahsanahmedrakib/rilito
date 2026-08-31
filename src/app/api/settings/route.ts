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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
