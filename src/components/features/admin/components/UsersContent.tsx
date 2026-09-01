"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PlusIcon, TrashIcon, UserIcon } from "@/components/shared/components/icons";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600";

const roleBadge = (role: string) =>
  role === "superadmin"
    ? "bg-violet-100 text-violet-800"
    : "bg-brand-100 text-brand-800";

function UserRow({
  user,
  isSelf,
  canManage,
  canChangeRole,
  onUpdate,
  onDelete,
}: {
  user: { id: string; name: string; email: string; role: "superadmin" | "admin"; password?: string };
  isSelf: boolean;
  canManage: boolean;
  canChangeRole: boolean;
  onUpdate: (patch: { name?: string; role?: string; password?: string }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState("");

  const save = async () => {
    await onUpdate({
      ...(canChangeRole && role !== user.role ? { role } : {}),
      ...(name !== user.name ? { name } : {}),
      ...(password ? { password } : {}),
    });
    setPassword("");
    setEditing(false);
  };

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-950 text-brand-500">
            <UserIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-ink-950">
              {user.name}
              {isSelf && <span className="ml-2 text-xs font-bold text-ink-400">(you)</span>}
            </p>
            <p className="truncate text-xs text-ink-500">{user.email}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold uppercase", roleBadge(user.role))}>
            {user.role}
          </span>
          {canManage && (
            <button
              onClick={() => setEditing((v) => !v)}
              className="rounded-lg bg-ink-100 px-3 py-1.5 text-xs font-bold text-ink-800 transition hover:bg-ink-200"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          )}
          {canManage && (
            <button
              onClick={onDelete}
              className="grid h-8 w-8 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
              aria-label="Delete user"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Show password as hash */}
      {user.password && (
        <div className="mt-3 rounded-xl bg-ink-50 px-4 py-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">Password (hash)</p>
          <p className="mt-0.5 break-all font-mono text-xs text-ink-700">{user.password}</p>
        </div>
      )}

      {editing && (
        <div className="mt-4 grid gap-4 border-t border-ink-100 pt-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          {canChangeRole && (
            <div>
              <label className={labelCls}>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "superadmin")} className={inputCls}>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          )}
          <div>
            <label className={labelCls}>New Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              className={inputCls}
              placeholder="Leave blank to keep"
            />
          </div>
          <button
            onClick={save}
            className="rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600 sm:col-span-3"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default function UsersContent() {
  const {
    adminUsers,
    adminUser,
    isSuperadmin,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toast,
  } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!name.trim() || !email.trim() || !password) {
      toast("Missing fields", "Name, email and password are required", "info");
      return;
    }
    setSubmitting(true);
    const res = await addAdminUser({ name: name.trim(), email: email.trim(), password });
    setSubmitting(false);
    if (res.ok) {
      toast("User added", `${name.trim()} can now sign in`);
      setName("");
      setEmail("");
      setPassword("");
    } else {
      toast("Could not add user", res.error, "info");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Admin Users
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Manage who can access the admin panel. The first account is the super admin;
        only a super admin can add, edit roles, or delete users.
      </p>

      {!isSuperadmin && (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
          You have view-only access. A super admin can invite more users or change roles.
        </p>
      )}

      {/* Add user */}
      {isSuperadmin && (
        <section className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-tight text-ink-950">
            <PlusIcon className="h-5 w-5 text-brand-600" /> Add Admin User
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            New users are added as regular admins.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Rahim" />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputCls} placeholder="user@rilito.com" />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" className={inputCls} placeholder="Temporary password" />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="mt-4 rounded-xl bg-ink-950 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add User"}
          </button>
        </section>
      )}

      {/* User list */}
      <div className="mt-6 space-y-3">
        {adminUsers.length === 0 ? (
          <p className="rounded-2xl bg-white py-16 text-center text-sm text-ink-500 ring-1 ring-ink-200/60">
            No admin users found.
          </p>
        ) : (
          adminUsers.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              isSelf={adminUser?.id === u.id}
              canManage={isSuperadmin && adminUser?.id !== u.id && u.role !== "superadmin"}
              canChangeRole={isSuperadmin && adminUser?.id !== u.id}
              onUpdate={async (patch) => {
                const res = await updateAdminUser(u.id, patch);
                if (res.ok) toast("User updated", u.email);
                else toast("Could not update user", res.error, "info");
              }}
              onDelete={async () => {
                const res = await deleteAdminUser(u.id);
                if (res.ok) toast("User deleted", u.email);
                else toast("Could not delete user", res.error, "info");
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
