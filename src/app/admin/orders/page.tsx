import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { AdminTable } from "@/app/admin/products/page";

export const dynamic = "force-dynamic";

async function updateOrderStatus(formData: FormData) {
  "use server";
  await prisma.order.update({
    where: { id: String(formData.get("id")) },
    data: { status: String(formData.get("status")) },
  });
  revalidatePath("/admin/orders");
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell>
      <h1 className="text-3xl font-black">Orders</h1>
      <AdminTable headers={["Customer", "Contact", "Items", "Address", "Status", "Total"]}>
        {orders.map((order) => (
          <tr key={order.id} className="border-t border-stone-200 align-top">
            <td className="p-3">
              <p className="font-semibold">{order.customerName}</p>
              <p className="text-xs text-stone-500">{order.id}</p>
            </td>
            <td className="p-3">
              <p>{order.phone}</p>
              <p className="text-xs text-stone-500">{order.email}</p>
            </td>
            <td className="p-3">
              {order.items.map((item) => (
                <p key={item.id}>{item.product.name} x {item.quantity}</p>
              ))}
            </td>
            <td className="p-3 max-w-64">
              <p>{order.address}</p>
              <p className="text-xs font-semibold text-stone-500">{order.city}</p>
            </td>
            <td className="p-3">
              <form action={updateOrderStatus} className="flex gap-2">
                <input type="hidden" name="id" value={order.id} />
                <select name="status" defaultValue={order.status} className="admin-input min-w-32">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="btn-secondary py-2">Save</button>
              </form>
            </td>
            <td className="p-3 font-bold">{formatPrice(order.total)}</td>
          </tr>
        ))}
      </AdminTable>
    </AdminShell>
  );
}
