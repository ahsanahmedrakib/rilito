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
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
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
    const keys: { key: string; isArray: boolean }[] = [
      { key: "qrImage", isArray: false },
      { key: "paymentNumber", isArray: false },
      { key: "paymentNote", isArray: false },
      { key: "marqueeTexts", isArray: true },
    ];
    for (const { key, isArray } of keys) {
      if (body[key] !== undefined) {
        const value = isArray
          ? Array.isArray(body[key])
            ? body[key]
            : [body[key]]
          : String(body[key]);
        await Setting.updateOne(
          { key },
          { $set: { value } },
          { upsert: true }
        ).exec();
      }
    }
    const settings = await readSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("[admin/settings PATCH]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
