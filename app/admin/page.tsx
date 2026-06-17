import Link from "next/link";
import {
  listAdminCampaigns,
  listAdminEvents,
  listAdminProducts,
} from "@/lib/admin/catalog.server";

export default async function AdminDashboardPage() {
  const [products, events, campaigns] = await Promise.all([
    listAdminProducts(),
    listAdminEvents(),
    listAdminCampaigns(),
  ]);

  const cards = [
    {
      href: "/admin/products",
      label: "เสื้อผ้า",
      count: products.length,
      description: "จัดการรายการเช่าชุด ราคา ไซส์ และรายละเอียดสินค้า",
    },
    {
      href: "/admin/events",
      label: "กิจกรรมชุมชน",
      count: events.length,
      description: "จัดการอีเวนต์ วันที่ สถานที่ และสินค้าแนะนำ",
    },
    {
      href: "/admin/campaigns",
      label: "แคมเปญ",
      count: campaigns.length,
      description: "จัดการโปรโมชัน เงื่อนไข และรางวัล",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">หลังบ้าน</h1>
      <p className="mt-1 text-sm text-zinc-500">
        จัดการข้อมูลในระบบ Tua Plew — เฉพาะผู้ดูแลระบบเท่านั้น
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-3xl font-bold text-blue-600">{card.count}</p>
            <p className="mt-1 font-semibold text-zinc-900">{card.label}</p>
            <p className="mt-2 text-sm text-zinc-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
