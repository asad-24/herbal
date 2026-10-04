"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";

const nav = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Certificates", "/certificates"],
  ["Lab Reports", "/lab-reports"],
  ["Contact", "/contact"],
];

export function Header({ storeName }: { storeName: string }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="bg-emerald-950 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-emerald-50">
        Delivering nationwide | Cash on delivery | WhatsApp support
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-black tracking-tight text-emerald-950">
          {storeName}
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-stone-700 hover:text-emerald-800">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <form action="/shop" className="hidden items-center gap-2 rounded-md border border-stone-200 px-3 py-2 lg:flex">
            <Search size={16} className="text-stone-400" />
            <input
              name="q"
              placeholder="Search products"
              className="w-44 bg-transparent text-sm outline-none"
            />
          </form>
          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-md border border-stone-200 text-emerald-950 hover:bg-emerald-50"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {count ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-emerald-950">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-stone-200 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-semibold text-stone-700 hover:bg-emerald-50"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
