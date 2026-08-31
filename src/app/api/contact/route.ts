import { NextRequest, NextResponse } from "next/server";
import { ContactQuery, connectDb } from "@/lib/db/models";
import { toPlain } from "@/lib/db/serialize";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();
    if (!name || !subject || !message) {
      return NextResponse.json(
        { error: "name, subject and message are required" },
        { status: 400 }
      );
    }
    const doc = await ContactQuery.create({ name, phone, email, subject, message });
    return NextResponse.json({ query: { id: String(doc._id), ...toPlain<Record<string, unknown>>(doc) } }, { status: 201 });
  } catch (err) {
    console.error("[contact POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
