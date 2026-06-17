import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth-admin";
import {
  listAdminCampaigns,
  listAdminEvents,
  listAdminProducts,
} from "@/lib/admin/catalog.server";

export const metadata: Metadata = {
  title: "หลังบ้าน — Tua Plew",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  const [products, events, campaigns] = await Promise.all([
    listAdminProducts(),
    listAdminEvents(),
    listAdminCampaigns(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:py-8">
      <aside className="shrink-0 lg:w-48">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
          Admin
        </p>
        <AdminNav />
        <div className="mt-6 hidden rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-500 lg:block">
          <p>เสื้อผ้า {products.length}</p>
          <p>กิจกรรม {events.length}</p>
          <p>แคมเปญ {campaigns.length}</p>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
