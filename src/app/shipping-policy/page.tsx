import { StoreShell } from "@/components/StoreShell";

export const dynamic = "force-dynamic";

export function PolicyPage({ title, body }: { title: string; body: string }) {
  return (
    <StoreShell>
      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-black">{title}</h1>
          <p className="mt-5 leading-8 text-stone-700">{body}</p>
        </div>
      </section>
    </StoreShell>
  );
}

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      body="Orders are prepared after confirmation and shipped nationwide. Delivery timelines, charges, and courier availability should be finalized by the store owner before public launch."
    />
  );
}
