"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";

const NAV_ITEMS = [
  {
    href: "/map",
    label: "แผนที่",
    match: (path: string) => path === "/map",
  },
  {
    href: "/community",
    label: "ชุมชน",
    match: (path: string) => path.startsWith("/community"),
  },
  {
    href: "/campaigns",
    label: "แคมเปญ",
    match: (path: string) => path.startsWith("/campaigns"),
  },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const hideAuth = pathname === "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold text-emerald-600"
        >
          Fit-to-Go
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3 ${
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {!hideAuth && (
          <div className="shrink-0">
            <AuthButton />
          </div>
        )}
        {hideAuth && <div className="w-16 shrink-0 sm:w-20" aria-hidden />}
      </div>
    </header>
  );
}
