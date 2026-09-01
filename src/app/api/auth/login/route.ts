import { NextRequest, NextResponse } from "next/server";
import {
  AdminUser,
  connectDb,
  seedSuperAdmin,
  verifyPassword,
} from "@/lib/db/models";
import { setAuthCookies, toAdminPayload } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    await seedSuperAdmin();

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

    const user = await AdminUser.findOne({ email }).exec();
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const payload = toAdminPayload(user);
    await setAuthCookies(payload);

    return NextResponse.json({ user: user.toJSON(), role: payload.role });
  } catch (err) {
    console.error("[auth/login]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
