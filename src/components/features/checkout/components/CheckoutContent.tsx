"use client";

import { discountForCoupon } from "@/lib/coupons";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FREE_SHIPPING_THRESHOLD,
  quoteShipping,
  type DeliveryMethodId,
  type PaymentMethodId,
} from "../data/checkout";
import { checkoutSchema, type CheckoutAddress } from "../data/checkoutSchemas";
import { CheckoutAddressForm } from "./CheckoutAddressForm";
import { CheckoutDeliveryMethod } from "./CheckoutDeliveryMethod";
import { CheckoutPaymentMethod } from "./CheckoutPaymentMethod";
import { CheckoutSummary } from "./CheckoutSummary";

export function CheckoutContent() {
  const { cart, cartSubtotal, clearCart, placeOrder, toast, user, coupons } =
    useStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutAddress>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      address: user?.address ?? "",
      city: user?.city ?? "Dhaka",
      area: "",
      note: "",
    },
  });
  const phone = watch("phone");
  const [delivery, setDelivery] = useState<DeliveryMethodId>("standard");
  const [payment, setPayment] = useState<PaymentMethodId>("cod");
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);

  const shipping = quoteShipping({ subtotal: cartSubtotal, delivery });
  const total = cartSubtotal - discount + shipping;

  const applyPromo = (code: string) => {
    const value = discountForCoupon(coupons, code, cartSubtotal);
    if (value > 0) {
      setDiscount(value);
      toast(
        "Coupon applied",
        `${code.trim().toUpperCase()} — ${formatPrice(value)} off`,
      );
    } else {
      toast("Invalid coupon", "This code isn't active", "info");
    }
  };

  const place = handleSubmit((values: CheckoutAddress) => {
    setPlacing(true);
    setTimeout(async () => {
      const order = await placeOrder({
        items: cart,
        subtotal: cartSubtotal,
        shipping,
        discount,
        name: values.name,
        phone: values.phone,
        email: values.email ?? "",
        address: values.address,
        city: values.city,
        area: values.area ?? "",
        payment,
      });
      clearCart();
      setPlacing(false);
      router.push(`/order/${order.id}`);
      toast("Order placed!", `Your order ID is ${order.id}`);
    }, 1200);
  });

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950">
          Nothing to checkout
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Your cart is empty — add something first.
        </p>
        <Link
          href="/products"
          className="mt-7 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold uppercase text-white transition hover:bg-brand-700"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Checkout
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <CheckoutAddressForm register={register} errors={errors} />
          <CheckoutDeliveryMethod
            delivery={delivery}
            freeDelivery={cartSubtotal >= FREE_SHIPPING_THRESHOLD}
            onSelect={setDelivery}
          />
          <CheckoutPaymentMethod
            payment={payment}
            total={total}
            phone={phone}
            onSelect={setPayment}
          />
        </div>

        <CheckoutSummary
          items={cart}
          subtotal={cartSubtotal}
          discount={discount}
          shipping={shipping}
          total={total}
          onApplyPromo={applyPromo}
          placing={placing}
          onPlaceOrder={place}
        />
      </div>
    </div>
  );
}

export default CheckoutContent;

