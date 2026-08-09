"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { LoginForm } from "@/components/features/auth/components/LoginForm";

export default function LoginPage() {
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <LoginForm />
      <div className="mt-5 rounded-2xl bg-ink-100 p-4 text-center text-xs text-ink-600">
        Demo tip: register an account and place a test order — everything is stored on this
        device.
      </div>
    </div>
  );
}