"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { CartLine } from "@/types/cart";

export function AddToCartButton({
  item,
  compact = false,
}: {
  item: Omit<CartLine, "quantity">;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={item.stock < 1}
      onClick={() => {
        addItem(item);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300 ${
        compact ? "w-full py-2.5" : ""
      }`}
    >
      <ShoppingBag size={18} />
      {item.stock < 1 ? "Sold out" : added ? "Added" : "Add to cart"}
    </button>
  );
}

