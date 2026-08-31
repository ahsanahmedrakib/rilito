import { NextRequest, NextResponse } from "next/server";
import {
  AdminUser,
  connectDb,
  hashPassword,
} from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    const users = await AdminUser.find().sort({ createdAt: 1 }).lean().exec();
    return NextResponse.json({ users });
  } catch (err) {
    console.error("[admin/users GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request, "superadmin");
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

    const existing = await AdminUser.findOne({ email }).exec();
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // First user is superadmin; every user added afterwards is an admin (req #7).
    const count = await AdminUser.countDocuments().exec();
    const role = count === 0 ? "superadmin" : "admin";

    const user = await AdminUser.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      role,
    });

    return NextResponse.json(
      { user: user.toJSON(), role },
      { status: 201 }
    );
  } catch (err) {
    console.error("[admin/users POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
