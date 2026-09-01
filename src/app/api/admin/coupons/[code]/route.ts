import { NextRequest, NextResponse } from "next/server";
import { Coupon, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import { toPlain } from "@/lib/db/serialize";

type Ctx = { params: Promise<{ code: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { code } = await ctx.params;
  try {
    await connectDb();
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const doc = await Coupon.findOne({ code: code.toUpperCase() }).exec();
    if (!doc) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    if (body.type !== undefined) {
      const t = String(body.type).toLowerCase();
      if (!["percent", "fixed"].includes(t)) {
        return NextResponse.json({ error: "Invalid coupon type" }, { status: 400 });
      }
      doc.type = t as "percent" | "fixed";
    }
    if (body.value !== undefined) doc.value = Number(body.value);
    if (body.active !== undefined) doc.active = Boolean(body.active);
    await doc.save();
    return NextResponse.json({ coupon: toPlain(doc) });
  } catch (err) {
    console.error("[admin/coupons PATCH]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { code } = await ctx.params;
  try {
    await connectDb();
    const doc = await Coupon.findOne({ code: code.toUpperCase() }).exec();
    if (!doc) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    await Coupon.deleteOne({ _id: doc._id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/coupons DELETE]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
