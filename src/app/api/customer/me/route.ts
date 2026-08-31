import { NextRequest, NextResponse } from "next/server";
import { Customer, connectDb } from "@/lib/db/models";
import { getRequestPayload } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getRequestPayload(request);
    if (!payload || payload.kind !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDb();
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const customer = await Customer.findById(payload.sub).exec();
    if (!customer) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    if (body.name !== undefined) customer.name = String(body.name);
    if (body.phone !== undefined) customer.phone = String(body.phone);
    if (body.address !== undefined) customer.address = String(body.address);
    if (body.city !== undefined) customer.city = String(body.city);
    await customer.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = customer.toObject();
    return NextResponse.json({ user: rest });
  } catch (err) {
    console.error("[customer/me PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
