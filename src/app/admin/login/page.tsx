"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";
import { useStore } from "@/lib/store";

export default function AdminLoginPage() {
  const { ready, isAdmin, loginAdmin, toast } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && isAdmin) router.replace("/admin");
  }, [ready, isAdmin, router]);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <AdminLoginForm
        onLogin={(email, password) => {
          const ok = loginAdmin(email, password);
          if (ok) {
            toast("Welcome, admin", "Signed in to the dashboard");
            router.push("/admin");
          } else {
            toast("Sign in failed", "Check your admin credentials", "info");
          }
          return ok;
        }}
      />
    </div>
  );
}