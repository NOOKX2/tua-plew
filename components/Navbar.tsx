"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "@/lib/i18n/client";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const navItems = [
    { href: "/map", label: t("nav.map"), match: (path: string) => path === "/map" },
    {
      href: "/community",
      label: t("nav.community"),
      match: (path: string) => path.startsWith("/community"),
    },
    {
      href: "/campaigns",
      label: t("nav.campaigns"),
      match: (path: string) => path.startsWith("/campaigns"),
    },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#faf9f6]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#faf9f6]/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-zinc-900"
        >
          Tua <span className="text-emerald-600">Plew</span>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
          {navItems.map((item) => {
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
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
