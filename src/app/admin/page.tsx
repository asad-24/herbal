import Link from "next/link";
import { Package, ReceiptText, ShieldCheck, Tags } from "lucide-react";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, categories, orders, certificates, latestOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.certificate.count(),
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <AdminShell>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Overview</p>
          <h1 className="text-3xl font-black">Admin dashboard</h1>
        </div>
        <Link href="/" className="btn-secondary">View store</Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat icon={<Package />} label="Products" value={products} />
        <Stat icon={<Tags />} label="Categories" value={categories} />
        <Stat icon={<ReceiptText />} label="Orders" value={orders.length} />
        <Stat icon={<ShieldCheck />} label="Documents" value={certificates} />
      </div>
      <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Sales snapshot</h2>
        <p className="mt-2 text-3xl font-black text-emerald-900">{formatPrice(revenue)}</p>
        <p className="mt-1 text-sm text-stone-600">Total COD order value in local database.</p>
      </div>
      <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Latest orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase tracking-wide text-stone-600">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">City</th>
                <th className="p-3">Items</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id} className="border-t border-stone-200">
                  <td className="p-3 font-semibold">{order.customerName}</td>
                  <td className="p-3">{order.city}</td>
                  <td className="p-3">{order.items.length}</td>
                  <td className="p-3 capitalize">{order.status}</td>
                  <td className="p-3 font-bold">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="text-emerald-700">{icon}</div>
      <p className="mt-4 text-sm font-semibold text-stone-500">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}
