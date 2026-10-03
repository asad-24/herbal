"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/types/cart";

type CartContextValue = {
  items: CartLine[];
  count: number;
  total: number;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "waheed-herbal-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      count,
      total,
      addItem: (item, quantity = 1) => {
        setItems((current) => {
          const existing = current.find((line) => line.productId === item.productId);
          if (!existing) {
            return [...current, { ...item, quantity: Math.min(quantity, item.stock) }];
          }
          return current.map((line) =>
            line.productId === item.productId
              ? {
                  ...line,
                  quantity: Math.min(line.quantity + quantity, line.stock),
                }
              : line,
          );
        });
      },
      updateQuantity: (productId, quantity) => {
        setItems((current) =>
          current
            .map((line) =>
              line.productId === productId
                ? { ...line, quantity: Math.max(1, Math.min(quantity, line.stock)) }
                : line,
            )
            .filter((line) => line.quantity > 0),
        );
      },
      removeItem: (productId) => {
        setItems((current) => current.filter((line) => line.productId !== productId));
      },
      clearCart: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }
  return value;
}
