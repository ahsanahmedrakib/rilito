"use client";

import { MailIcon } from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import { useState } from "react";

export function Newsletter() {
  const { toast } = useStore();
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast("Invalid email", "Please enter a valid email address", "info");
      return;
    }
    toast(
      "You're on the list!",
      "Watch your inbox for exclusive drops and offers",
    );
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-ink-950 py-16 md:py-20">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-600/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white">
          <MailIcon className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          Get 10% Off Your First Order
        </h2>
        <p className="mt-3 text-sm text-ink-300 md:text-base">
          Join the Rilito insider list — early access to drops, private sales
          and styling tips. No spam, ever.
        </p>
        <form
          onSubmit={submit}
          className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-sm text-white outline-none backdrop-blur placeholder:text-ink-400 focus:border-brand-500"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-xs text-ink-400">
          Use code{" "}
          <span className="font-mono font-bold text-brand-400">RILITO10</span>{" "}
          at checkout
        </p>
      </div>
    </section>
  );
}
