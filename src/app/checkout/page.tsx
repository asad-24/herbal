import { CheckoutView } from "@/app/checkout/CheckoutView";
import { StoreShell } from "@/components/StoreShell";

export default function CheckoutPage() {
  return (
    <StoreShell>
      <section className="container-page py-10">
        <CheckoutView />
      </section>
    </StoreShell>
  );
}

