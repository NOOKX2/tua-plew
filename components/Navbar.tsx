"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAuthRoute, isAdminRoute, mainNavItems } from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n/client";
import AuthButton from "./AuthButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { useUser } from "./UserProvider";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();
  const { sessionUser, activeRentalCount } = useUser();

  if (isAuthRoute(pathname) || isAdminRoute(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#faf9f6]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#faf9f6]/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
        >
          Tua <span className="text-blue-600">Plew</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex sm:gap-2">
          {mainNavItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
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
          <AuthButton
            initialActiveRentals={activeRentalCount}
            sessionUser={sessionUser}
          />
        </div>
      </div>
    </header>
  );
}
