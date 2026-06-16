"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/lib/i18n/client";

const tabs = [
  { href: "/rentals/shop", key: "map.viewListTab" as const, icon: "👕" },
  { href: "/map", key: "map.viewMapTab" as const, icon: "🗺️" },
];

export default function RentalViewTabs() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div className="flex w-full items-center gap-1 border-b border-zinc-200 bg-white px-3 py-2 sm:px-4">
      <div className="mx-auto flex w-full max-w-7xl gap-1.5">
        {tabs.map((tab) => {
          const active =
            tab.href === "/map"
              ? pathname === "/map"
              : pathname.startsWith("/rentals/shop");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${active
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
            >
              <span aria-hidden>{tab.icon}</span>
              {t(tab.key)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
