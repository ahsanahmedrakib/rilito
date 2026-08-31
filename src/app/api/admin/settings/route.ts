import { NextRequest, NextResponse } from "next/server";
import { Setting, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import { readSettings } from "@/lib/db/seed";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    await connectDb();
    const settings = await readSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("[admin/settings GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    await connectDb();
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const keys = ["qrImage", "paymentNumber", "paymentNote"];
    for (const key of keys) {
      if (body[key] !== undefined) {
        await Setting.updateOne(
          { key },
          { $set: { value: String(body[key]) } },
          { upsert: true }
        ).exec();
      }
    }
    const settings = await readSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("[admin/settings PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
