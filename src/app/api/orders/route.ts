import { NextRequest, NextResponse } from "next/server";
import { Order, connectDb, type OrderDoc } from "@/lib/db/models";
import { generateOrderId } from "@/features/order/data/status";
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
    if (!body.items || !body.name || !body.phone || !body.address) {
      return NextResponse.json(
        { error: "items, name, phone and address are required" },
        { status: 400 }
      );
    }
    const order = await Order.create({
      id: generateOrderId(),
      items: body.items as unknown as OrderDoc["items"],
      subtotal: Number(body.subtotal ?? 0),
      shipping: Number(body.shipping ?? 0),
      discount: Number(body.discount ?? 0),
      total: Number(body.total ?? 0),
      name: String(body.name),
      phone: String(body.phone),
      email: String(body.email ?? ""),
      address: String(body.address),
      city: String(body.city ?? ""),
      area: String(body.area ?? ""),
      payment: String(body.payment ?? "cod"),
      status: "Order Placed",
      date: new Date().toISOString(),
    });
    return NextResponse.json({ order: toPlain(order) }, { status: 201 });
  } catch (err) {
    console.error("[orders POST]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Order id is required" }, { status: 400 });
    }
    const order = await Order.findOne({ id: String(id) }).lean().exec();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order: toPlain(order) });
  } catch (err) {
    console.error("[orders GET]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
