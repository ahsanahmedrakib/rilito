import { NextRequest, NextResponse } from "next/server";
import { Coupon, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import { toPlain } from "@/lib/db/serialize";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    await connectDb();
    const coupons = await Coupon.find().lean().exec();
    return NextResponse.json({ coupons: coupons.map(toPlain) });
  } catch (err) {
    console.error("[admin/coupons GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const code = String(body.code ?? "")
      .trim()
      .toUpperCase();
    const type = String(body.type ?? "").toLowerCase();
    const value = Number(body.value);
    if (!code || !["percent", "fixed"].includes(type) || Number.isNaN(value)) {
      return NextResponse.json(
        { error: "code, a valid type and value are required" },
        { status: 400 }
      );
    }
    const existing = await Coupon.findOne({ code }).exec();
    if (existing) {
      return NextResponse.json(
        { error: "A coupon with this code already exists" },
        { status: 409 }
      );
    }
    const doc = await Coupon.create({
      code,
      type: type as "percent" | "fixed",
      value,
      active: body.active !== undefined ? Boolean(body.active) : true,
    });
    return NextResponse.json({ coupon: toPlain(doc) }, { status: 201 });
  } catch (err) {
    console.error("[admin/coupons POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
