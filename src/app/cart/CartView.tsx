"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <p className="mt-3 text-stone-600">Add herbal products and come back here for COD checkout.</p>
        <Link href="/shop" className="btn-primary mt-6">Shop products</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.productId} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-[8rem_1fr_auto]">
            <ProductImage image={item.image} name={item.name} />
            <div>
              <Link href={`/products/${item.slug}`} className="text-lg font-black">{item.name}</Link>
              <p className="mt-2 text-sm font-bold text-emerald-800">{formatPrice(item.price)}</p>
              <button onClick={() => removeItem(item.productId)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700">
                <Trash2 size={16} />
                Remove
              </button>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <button className="rounded border border-stone-200 p-2" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold">{item.quantity}</span>
              <button className="rounded border border-stone-200 p-2" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Order summary</h2>
        <div className="mt-5 flex justify-between border-t border-stone-200 pt-4 text-lg font-black">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-stone-600">Shipping charges can be confirmed by admin after order review.</p>
        <Link href="/checkout" className="btn-primary mt-5 w-full">Proceed to checkout</Link>
      </aside>
    </div>
  );
}

