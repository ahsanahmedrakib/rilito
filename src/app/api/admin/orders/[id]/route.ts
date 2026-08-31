import { NextRequest, NextResponse } from "next/server";
import { Order, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import { toPlain } from "@/lib/db/serialize";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id } = await ctx.params;
  try {
    await connectDb();
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const order = await Order.findOne({ id }).exec();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (
      body.status !== undefined &&
      String(body.status) !== String(order.status)
    ) {
      order.status = String(body.status);
    }

    if (body.tracking !== undefined) {
      const t = (body.tracking ?? {}) as Record<string, unknown>;
      order.tracking = {
        courier: String(t.courier ?? ""),
        trackingId: String(t.trackingId ?? ""),
        note: String(t.note ?? ""),
      };
    }

    await order.save();
    return NextResponse.json({ order: toPlain(order) });
  } catch (err) {
    console.error("[admin/orders PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
