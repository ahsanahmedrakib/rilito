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
    const keys: { key: string; type: "string" | "number" | "array" | "raw" }[] = [
      { key: "qrImage", type: "string" },
      { key: "paymentNumber", type: "string" },
      { key: "paymentNote", type: "string" },
      { key: "shippingFee", type: "number" },
      { key: "freeShippingThreshold", type: "number" },
      { key: "marqueeTexts", type: "array" },
      { key: "heroSlides", type: "raw" },
      { key: "homeValues", type: "raw" },
      { key: "testimonials", type: "raw" },
      { key: "editorialBanner", type: "raw" },
      { key: "blogPosts", type: "raw" },
      { key: "pageContents", type: "raw" },
      { key: "faqs", type: "raw" },
      { key: "newsletter", type: "raw" },
    ];
    for (const { key, type } of keys) {
      if (body[key] !== undefined) {
        let value: unknown;
        if (type === "array") {
          value = Array.isArray(body[key]) ? body[key] : [body[key]];
        } else if (type === "number") {
          value = Number(body[key]) || 0;
        } else if (type === "string") {
          value = String(body[key]);
        } else {
          value = body[key];
        }
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
