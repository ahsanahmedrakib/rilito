import { NextRequest, NextResponse } from "next/server";
import { AdminUser, connectDb, hashPassword } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id } = await ctx.params;
  const isSelf = auth.payload!.sub === id;

  try {
    await connectDb();

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const target = await AdminUser.findById(id).exec();
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wantsRoleChange = body.role !== undefined && body.role !== target.role;
    if (wantsRoleChange && auth.payload!.role !== "superadmin") {
      return NextResponse.json(
        { error: "Only a super admin can change user roles" },
        { status: 403 }
      );
    }

    // Changing another user's details requires superadmin unless it's your own password.
    if (!isSelf && auth.payload!.role !== "superadmin") {
      return NextResponse.json(
        { error: "You can only change your own details" },
        { status: 403 }
      );
    }

    if (body.name !== undefined) target.name = String(body.name).trim();
    if (body.password !== undefined && String(body.password).length > 0) {
      target.passwordHash = await hashPassword(String(body.password));
    }

    const newRole =
      body.role !== undefined ? (String(body.role) as "admin" | "superadmin") : target.role;
    if (newRole !== target.role) {
      if (newRole !== "superadmin" && target.role === "superadmin") {
        // Can't demote yourself if you're the last superadmin.
        const superCount = await AdminUser.countDocuments({
          role: "superadmin",
        }).exec();
        if (superCount <= 1) {
          return NextResponse.json(
            { error: "Cannot demote the last super admin" },
            { status: 400 }
          );
        }
      }
      target.role = newRole;
    }

    await target.save();
    return NextResponse.json({ user: target.toJSON() });
  } catch (err) {
    console.error("[admin/users PATCH]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(request, "superadmin");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id } = await ctx.params;

  try {
    await connectDb();
    const target = await AdminUser.findById(id).exec();
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Block deleting yourself and the last super admin (single-user protection).
    if (String(target._id) === auth.payload!.sub) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }
    if (target.role === "superadmin") {
      const superCount = await AdminUser.countDocuments({
        role: "superadmin",
      }).exec();
      if (superCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last super admin" },
          { status: 400 }
        );
      }
    }
    const total = await AdminUser.countDocuments().exec();
    if (total <= 1) {
      return NextResponse.json(
        { error: "The only admin account cannot be deleted" },
        { status: 400 }
      );
    }

    await AdminUser.deleteOne({ _id: target._id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/users DELETE]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
