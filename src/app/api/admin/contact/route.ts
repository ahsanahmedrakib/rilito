import { NextRequest, NextResponse } from "next/server";
import { ContactQuery, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import { toPlain } from "@/lib/db/serialize";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    await connectDb();
    const queries = await ContactQuery.find().sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({
      queries: queries.map((q) => ({ id: String(q._id), ...toPlain<Record<string, unknown>>(q) })),
    });
  } catch (err) {
    console.error("[admin/contact GET]", err);
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
    const id = String(body.id ?? "").trim();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    if (typeof body.read === "boolean") {
      await ContactQuery.findByIdAndUpdate(id, { read: body.read }).exec();
    }
    const doc = await ContactQuery.findById(id).lean().exec();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ query: { id: String(doc._id), ...toPlain<Record<string, unknown>>(doc) } });
  } catch (err) {
    console.error("[admin/contact PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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
    const id = String(body.id ?? "").trim();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const doc = await ContactQuery.findByIdAndDelete(id).exec();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/contact DELETE]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
