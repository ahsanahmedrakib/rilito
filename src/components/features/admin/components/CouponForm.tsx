"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { couponSchema, type CouponValues } from "@/features/admin/data/adminSchemas";
import type { Coupon } from "@/lib/types";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function CouponForm({
  coupon,
  onSubmit,
  onCancel,
}: {
  coupon?: Coupon;
  onSubmit: (coupon: Coupon) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CouponValues>({
    resolver: yupResolver(couponSchema),
    defaultValues: coupon
      ? { code: coupon.code, type: coupon.type, value: coupon.value, active: coupon.active }
      : { code: "", type: "percent", value: 10, active: true },
  });

  const submit = (values: CouponValues) => {
    onSubmit({
      code: values.code.trim().toUpperCase(),
      type: values.type as Coupon["type"],
      value: Number(values.value),
      active: Boolean(values.active),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase tracking-tight text-ink-950">
          {coupon ? `Edit ${coupon.code}` : "New Coupon"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-ink-200 px-3 py-1 text-xs font-bold text-ink-700 transition hover:border-ink-950"
        >
          Cancel
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Code *
          </label>
          <input className={cn(inputCls, errors.code && "border-red-400")} placeholder="SAVE20" {...register("code")} />
          {errors.code && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.code.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Type
          </label>
          <select className={inputCls} {...register("type")}>
            <option value="percent">Percent %</option>
            <option value="fixed">Fixed ৳</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Value *
          </label>
          <input className={cn(inputCls, errors.value && "border-red-400")} {...register("value")} />
          {errors.value && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.value.message}
            </p>
          )}
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-800">
            <input type="checkbox" className="h-4 w-4 accent-ink-950" {...register("active")} />
            Active
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-ink-950 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600"
      >
        {coupon ? "Save Coupon" : "Create Coupon"}
      </button>
    </form>
  );
}