import { NextRequest, NextResponse } from "next/server";
import { Customer, connectDb, verifyPassword } from "@/lib/db/models";
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
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const customer = await Customer.findOne({ email }).exec();
    if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    await setAuthCookies({
      sub: String(customer._id),
      email: customer.email,
      role: "customer",
      kind: "customer",
    });
    return NextResponse.json({ user: customer.toJSON() });
  } catch (err) {
    console.error("[customer/login]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
