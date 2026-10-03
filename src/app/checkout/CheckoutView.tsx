"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";

type SubmitState =
  | { status: "idle"; message: "" }
  | { status: "loading"; message: string }
  | { status: "success"; message: string; orderId: string; whatsappUrl: string }
  | { status: "error"; message: string };

export function CheckoutView() {
  const { items, total, clearCart } = useCart();
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading", message: "Placing your order..." });
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.get("customerName"),
        phone: form.get("phone"),
        email: form.get("email"),
        address: form.get("address"),
        city: form.get("city"),
        notes: form.get("notes"),
        items,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setState({ status: "error", message: payload.error || "Could not submit order." });
      return;
    }

    clearCart();
    setState({
      status: "success",
      message: "Order placed successfully.",
      orderId: payload.orderId,
      whatsappUrl: payload.whatsappUrl,
    });
  }

  if (!items.length && state.status !== "success") {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
        <h1 className="text-3xl font-black">No checkout items</h1>
        <p className="mt-3 text-stone-600">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary mt-6">Shop products</Link>
      </div>
    );
  }

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-black text-emerald-900">Order received</h1>
        <p className="mt-3 text-stone-600">Your order ID is {state.orderId}. Continue on WhatsApp to confirm delivery details.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={state.whatsappUrl} className="btn-primary">
            <MessageCircle size={18} />
            Continue on WhatsApp
          </a>
          <Link href={`/order-success?order=${state.orderId}`} className="btn-secondary">View success page</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <form onSubmit={submit} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-black">Cash on delivery checkout</h1>
        <p className="mt-2 text-stone-600">Submit your shipping details. Admin can review the order in the dashboard.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Full name" name="customerName" required />
          <Field label="Phone" name="phone" required />
          <Field label="Email" name="email" type="email" />
          <Field label="City" name="city" required />
          <label className="md:col-span-2">
            <span className="admin-label">Address</span>
            <textarea name="address" required className="store-input min-h-28" />
          </label>
          <label className="md:col-span-2">
            <span className="admin-label">Notes</span>
            <textarea name="notes" className="store-input min-h-24" />
          </label>
        </div>
        {state.status === "error" ? <p className="mt-4 text-sm font-semibold text-red-700">{state.message}</p> : null}
        <button disabled={state.status === "loading"} className="btn-primary mt-6">
          {state.status === "loading" ? "Submitting..." : "Place COD order"}
        </button>
      </form>
      <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Order items</h2>
        <div className="mt-5 grid gap-4">
          {items.map((item) => (
            <div key={item.productId} className="grid grid-cols-[4.5rem_1fr] gap-3">
              <ProductImage image={item.image} name={item.name} />
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="mt-1 text-sm text-stone-600">Qty {item.quantity}</p>
                <p className="mt-1 text-sm font-bold text-emerald-800">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-stone-200 pt-4 text-lg font-black">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label>
      <span className="admin-label">{label}</span>
      <input name={name} type={type} required={required} className="store-input" />
    </label>
  );
}

