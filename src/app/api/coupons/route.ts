import { NextResponse } from "next/server";
import { Coupon, connectDb } from "@/lib/db/models";
import { toPlain } from "@/lib/db/serialize";

export async function GET() {
  try {
    await connectDb();
    const coupons = await Coupon.find({ active: true }).lean().exec();
    return NextResponse.json({ coupons: coupons.map((c) => toPlain(c)) });
  } catch (err) {
    console.error("[coupons GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
