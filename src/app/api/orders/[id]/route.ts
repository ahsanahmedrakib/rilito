import { NextResponse } from "next/server";
import { Order, connectDb } from "@/lib/db/models";
import { toPlain } from "@/lib/db/serialize";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    await connectDb();
    const { id } = await ctx.params;
    const order = await Order.findOne({ id }).lean().exec();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order: toPlain(order) });
  } catch (err) {
    console.error("[orders/[id] GET]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
