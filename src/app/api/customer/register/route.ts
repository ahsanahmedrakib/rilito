import { NextRequest, NextResponse } from "next/server";
import { Customer, connectDb, hashPassword } from "@/lib/db/models";
import { setAuthCookies } from "@/lib/auth";

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
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    const existing = await Customer.findOne({ email }).exec();
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }
    const customer = await Customer.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      phone: String(body.phone ?? ""),
      address: String(body.address ?? ""),
      city: String(body.city ?? ""),
    });
    await setAuthCookies({
      sub: String(customer._id),
      email: customer.email,
      role: "customer",
      kind: "customer",
    });
    return NextResponse.json({ user: customer.toJSON() }, { status: 201 });
  } catch (err) {
    console.error("[customer/register]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
