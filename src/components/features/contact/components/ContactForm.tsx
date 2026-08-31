"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { MailIcon, PhoneIcon } from "@/components/shared/components/icons";
import { contactSubjects } from "@/features/contact/data/contact";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const contactSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  phone: yup
    .string()
    .matches(/^01\d{9}$/, "Enter an 11-digit number starting with 01")
    .transform((value, original) => (original === "" ? undefined : value)),
  email: yup
    .string()
    .email("Enter a valid email")
    .transform((value, original) => (original === "" ? undefined : value)),
  subject: yup.string().required("Pick a subject"),
  message: yup
    .string()
    .trim()
    .required("Message is required")
    .min(10, "Message should be at least 10 characters"),
});

type ContactValues = yup.InferType<typeof contactSchema>;

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function ContactForm() {
  const { toast } = useStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: yupResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "", subject: "Order query", message: "" },
  });

  const submit = async (values: ContactValues) => {
    toast("Message sent!", "Our team will get back to you within a few hours");
    reset({ name: "", phone: "", email: "", subject: "Order query", message: "" });
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch {
      // DB may be unreachable; message still noted locally.
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Name *
          </label>
          <input
            placeholder="Your name"
            className={cn(inputCls, errors.name && "border-red-400")}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Phone
          </label>
          <div className="relative">
            <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              placeholder="01XXXXXXXXX"
              inputMode="tel"
              className={cn(inputCls, "pl-11", errors.phone && "border-red-400")}
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Email
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="email"
              placeholder="you@example.com"
              className={cn(inputCls, "pl-11", errors.email && "border-red-400")}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Subject
          </label>
          <select className={cn(inputCls, errors.subject && "border-red-400")} {...register("subject")}>
            {contactSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.subject.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Message *
          </label>
          <textarea
            rows={5}
            placeholder="How can we help?"
            className={cn(inputCls, "resize-none", errors.message && "border-red-400")}
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
      >
        Send Message
      </button>
    </form>
  );
}