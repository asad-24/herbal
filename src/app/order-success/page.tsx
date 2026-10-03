import Link from "next/link";
import { StoreShell } from "@/components/StoreShell";

export default async function OrderSuccessPage({ searchParams }: PageProps<"/order-success">) {
  const params = await searchParams;
  const order = typeof params.order === "string" ? params.order : "";

  return (
    <StoreShell>
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl rounded-lg border border-emerald-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-4xl font-black text-emerald-900">Thank you for your order</h1>
          <p className="mt-4 leading-7 text-stone-600">
            {order ? `Order ${order} has been saved.` : "Your order has been saved."} Our team can confirm stock, shipping, and delivery details.
          </p>
          <Link href="/shop" className="btn-primary mt-7">Continue shopping</Link>
        </div>
      </section>
    </StoreShell>
  );
}

