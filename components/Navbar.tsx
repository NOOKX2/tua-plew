"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAuthRoute, mainNavItems } from "@/lib/navigation";
import AuthButton from "./AuthButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "@/lib/i18n/client";

export default function Navbar({
  activeRentalCount = 0,
}: {
  activeRentalCount?: number;
}) {
  const pathname = usePathname();
  const t = useTranslations();

  if (isAuthRoute(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#faf9f6]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#faf9f6]/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-zinc-900"
        >
          Tua <span className="text-emerald-600">Plew</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex sm:gap-2">
          {mainNavItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-white hover:text-zinc-900"
                }`}
              >
                {t(item.messageKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <AuthButton initialActiveRentals={activeRentalCount} />
        </div>
      </div>
    </header>
  );
}
