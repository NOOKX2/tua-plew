"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "ภาพรวม", exact: true },
  { href: "/admin/products", label: "เสื้อผ้า", exact: false },
  { href: "/admin/events", label: "กิจกรรม", exact: false },
  { href: "/admin/campaigns", label: "แคมเปญ", exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="mt-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 lg:mt-4"
      >
        ← กลับหน้าหลัก
      </Link>
    </nav>
  );
}
