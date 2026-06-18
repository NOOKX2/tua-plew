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
      <div className="mx-auto flex w-full max-w-7xl items-center gap-1.5">
        <div className="flex flex-1 gap-1.5">
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
        <Link
          href="/member/subscribe"
          className="hidden shrink-0 items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800 transition-colors hover:border-violet-300 hover:bg-violet-100 sm:inline-flex"
        >
          <span aria-hidden>✨</span>
          {t("subscription.title")}
        </Link>
      </div>
    </div>
  );
}
