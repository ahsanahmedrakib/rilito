"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { isValidPhone } from "@/features/auth/data/validation";
import { PROMO_CODE, PROMO_DISCOUNT_PERCENT } from "@/features/cart/data/shipping";
import {
  FREE_SHIPPING_THRESHOLD,
  quoteShipping,
  type DeliveryMethodId,
  type PaymentMethodId,
} from "@/features/checkout/data/checkout";
import {
  CheckoutAddressForm,
  type CheckoutAddress,
} from "@/components/features/checkout/components/CheckoutAddressForm";
import { CheckoutDeliveryMethod } from "@/components/features/checkout/components/CheckoutDeliveryMethod";
import { CheckoutPaymentMethod } from "@/components/features/checkout/components/CheckoutPaymentMethod";
import { CheckoutSummary } from "@/components/features/checkout/components/CheckoutSummary";

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, placeOrder, toast, user } = useStore();
  const router = useRouter();

  const [form, setForm] = useState<CheckoutAddress>({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    address: user?.address ?? "",
    city: user?.city ?? "Dhaka",
    area: "",
    note: "",
  });
  const [delivery, setDelivery] = useState<DeliveryMethodId>("standard");
  const [payment, setPayment] = useState<PaymentMethodId>("cod");
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);

  const set = (key: keyof CheckoutAddress) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const shipping = quoteShipping({ subtotal: cartSubtotal, delivery });
  const total = cartSubtotal - discount + shipping;

  const applyPromo = (code: string) => {
    if (code.trim().toUpperCase() === PROMO_CODE) {
      setDiscount(Math.round(cartSubtotal * (PROMO_DISCOUNT_PERCENT / 100)));
      toast("Coupon applied", "10% off (code RILITO10)");
    } else {
      toast("Invalid coupon", "Try RILITO10 for 10% off", "info");
    }
  };

  const place = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast("Missing details", "Please fill in your name, phone and address", "info");
      return;
    }
    if (!isValidPhone(form.phone)) {
      toast("Check phone number", "Enter an 11-digit number starting with 01", "info");
      return;
    }

    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({
        items: cart,
        subtotal: cartSubtotal,
        shipping,
        discount,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city,
        area: form.area.trim(),
        payment,
      });
      clearCart();
      setPlacing(false);
      router.push(`/order/${order.id}`);
      toast("Order placed!", `Your order ID is ${order.id}`);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950">
          Nothing to checkout
        </h1>
        <p className="mt-2 text-sm text-ink-500">Your cart is empty — add something first.</p>
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
          <CheckoutAddressForm form={form} onChange={set} />
          <CheckoutDeliveryMethod
            delivery={delivery}
            freeDelivery={cartSubtotal >= FREE_SHIPPING_THRESHOLD}
            onSelect={setDelivery}
          />
          <CheckoutPaymentMethod payment={payment} total={total} phone={form.phone} onSelect={setPayment} />
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