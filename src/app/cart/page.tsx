import { CartView } from "@/app/cart/CartView";
import { StoreShell } from "@/components/StoreShell";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <StoreShell>
      <section className="container-page py-10">
        <CartView />
      </section>
    </StoreShell>
  );
}
