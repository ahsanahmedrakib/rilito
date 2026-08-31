import { NextRequest, NextResponse } from "next/server";
import { Order, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import { toPlain } from "@/lib/db/serialize";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    await connectDb();
    const orders = await Order.find().sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ orders: orders.map(toPlain) });
  } catch (err) {
    console.error("[admin/orders GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
