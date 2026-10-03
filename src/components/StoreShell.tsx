import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/db";

export async function StoreShell({ children }: { children: ReactNode }) {
  const settings = await prisma.siteSetting.findFirst();
  const fallback = {
    storeName: "Waheed Herbal Store",
    phone: "+92 300 0000000",
    whatsappNumber: "923000000000",
    address: "Karachi, Pakistan",
    shippingText: "Nationwide delivery in 3-5 working days with Cash on Delivery.",
    supportCopy: "Need help choosing a remedy? Our support team can guide you on WhatsApp.",
  };
  const site = settings ?? fallback;

  return (
    <>
      <Header storeName={site.storeName} />
      <main>{children}</main>
      <Footer
        storeName={site.storeName}
        phone={site.phone}
        address={site.address}
        shippingText={site.shippingText}
      />
    </>
  );
}

