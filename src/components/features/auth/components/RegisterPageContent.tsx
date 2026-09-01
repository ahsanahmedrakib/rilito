"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { RegisterForm } from "@/components/features/auth/components/RegisterForm";

export function RegisterPageContent() {
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <RegisterForm />
    </div>
  );
}

export default RegisterPageContent;
