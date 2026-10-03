import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { StoreShell } from "@/components/StoreShell";
import { prisma } from "@/lib/db";

export default async function ContactPage() {
  const settings = await prisma.siteSetting.findFirst();

  return (
    <StoreShell>
      <section className="container-page grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Contact</p>
          <h1 className="mt-2 text-4xl font-black">Talk to herbal support</h1>
          <p className="mt-4 leading-7 text-stone-600">{settings?.supportCopy ?? "Send a message before ordering or after checkout."}</p>
          <div className="mt-8 grid gap-4">
            <ContactRow icon={<Phone size={20} />} title="Phone" text={settings?.phone ?? "+92 300 0000000"} />
            <ContactRow icon={<MessageCircle size={20} />} title="WhatsApp" text={settings?.whatsappNumber ?? "923000000000"} />
            <ContactRow icon={<MapPin size={20} />} title="Address" text={settings?.address ?? "Karachi, Pakistan"} />
            <ContactRow icon={<Mail size={20} />} title="Email" text="support@example.com" />
          </div>
        </div>
        <form className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Send an enquiry</h2>
          <div className="mt-5 grid gap-4">
            <input className="store-input" placeholder="Your name" />
            <input className="store-input" placeholder="Phone or email" />
            <textarea className="store-input min-h-36" placeholder="How can we help?" />
            <a href={`https://wa.me/${settings?.whatsappNumber ?? "923000000000"}`} className="btn-primary">
              Continue on WhatsApp
            </a>
          </div>
        </form>
      </section>
    </StoreShell>
  );
}

function ContactRow({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-stone-200 bg-white p-4">
      <div className="text-emerald-700">{icon}</div>
      <div>
        <p className="font-black">{title}</p>
        <p className="mt-1 text-sm text-stone-600">{text}</p>
      </div>
    </div>
  );
}
