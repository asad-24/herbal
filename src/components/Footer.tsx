import Link from "next/link";
import { Headphones, ShieldCheck, Truck, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function Footer({
  storeName,
  phone,
  address,
  shippingText,
}: {
  storeName: string;
  phone: string;
  address: string;
  shippingText: string;
}) {
  const trustItems: { Icon: LucideIcon; title: string; text: string }[] = [
    { Icon: Truck, title: "Shipping nationwide", text: shippingText },
    { Icon: ShieldCheck, title: "Original products", text: "Quality-first sourcing with certificate and lab report placeholders." },
    { Icon: Headphones, title: "Customer support", text: "Guidance available through phone and WhatsApp." },
    { Icon: WalletCards, title: "Cash on delivery", text: "Customers pay when the order arrives." },
  ];

  return (
    <footer className="mt-16 border-t border-stone-200 bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-4">
        {trustItems.map(({ Icon, title, text }) => (
          <div key={title} className="rounded-md border border-white/10 p-4">
            <Icon size={22} className="mb-3 text-amber-300" />
            <h3 className="font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-100">{text}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 border-t border-white/10 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <h2 className="text-2xl font-black">{storeName}</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-emerald-100">
            Original herbal products, organic herbs, oils, honey, and wellness essentials delivered across Pakistan.
          </p>
          <p className="mt-4 text-sm text-emerald-100">{address}</p>
          <p className="mt-1 text-sm font-bold">{phone}</p>
        </div>
        <FooterLinks title="Shop" links={[["All Products", "/shop"], ["Best Sellers", "/shop?filter=best"], ["Herbal Medicines", "/collections/herbal-medicines"], ["Hair & Skin Care", "/collections/hair-skin-care"]]} />
        <FooterLinks title="Support" links={[["Contact", "/contact"], ["Certificates", "/certificates"], ["Lab Reports", "/lab-reports"], ["Order Tracking", "/contact"]]} />
        <FooterLinks title="Company" links={[["Privacy Policy", "/privacy-policy"], ["Shipping Policy", "/shipping-policy"], ["Refund Policy", "/refund-policy"], ["Admin", "/admin"]]} />
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-emerald-100">
        Copyright © 2026 {storeName}. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="font-bold text-white">{title}</h3>
      <div className="mt-4 flex flex-col gap-2">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="text-sm text-emerald-100 hover:text-amber-200">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
