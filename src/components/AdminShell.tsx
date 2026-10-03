import { ReactNode } from "react";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";

export async function AdminShell({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-stone-50 lg:flex">
      <AdminNav />
      <section className="flex-1 p-4 lg:p-8">{children}</section>
    </main>
  );
}

