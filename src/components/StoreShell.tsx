import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/db";
import { fallbackSettings } from "@/lib/fallback-data";

export async function StoreShell({ children }: { children: ReactNode }) {
  const settings = await prisma.siteSetting.findFirst().catch(() => null);
  const site = settings ?? fallbackSettings;

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
