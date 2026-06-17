"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { Shirt } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  isAuthRoute,
  isAdminRoute,
  mainNavItems,
  type MainNavItem,
  type NavMessageKey,
} from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n/client";

function HomeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5L12 3l9 7.5M5 9.75V20a1 1 0 001 1h4v-5.5a1 1 0 011-1h2a1 1 0 011 1V21h4a1 1 0 001-1V9.75"
      />
    </svg>
  );
}

function CommunityIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function CampaignIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
      />
    </svg>
  );
}

function MemberIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

const iconByKey: Record<
  Exclude<NavMessageKey, "nav.rental">,
  ComponentType<{ className?: string }>
> = {
  "nav.home": HomeIcon,
  "nav.community": CommunityIcon,
  "nav.campaigns": CampaignIcon,
  "nav.member": MemberIcon,
};

function TabLink({ item, active }: { item: MainNavItem; active: boolean }) {
  const t = useTranslations();
  const Icon =
    iconByKey[item.messageKey as Exclude<NavMessageKey, "nav.rental">];

  return (
    <Link
      href={item.href}
      prefetch
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors ${
        active ? "text-blue-600" : "text-zinc-400"
      }`}
    >
      <Icon />
      <span className="max-w-full truncate text-xs font-semibold">
        {t(item.messageKey)}
      </span>
    </Link>
  );
}

export default function MobileTabBar() {
  const pathname = usePathname();
  const t = useTranslations();

  if (isAuthRoute(pathname) || isAdminRoute(pathname)) {
    return null;
  }

  const centerItem = mainNavItems.find((item) => item.centerAction);
  const sideItems = mainNavItems.filter((item) => !item.centerAction);
  const leftItems = sideItems.slice(0, 2);
  const rightItems = sideItems.slice(2);

  const centerActive = centerItem?.match(pathname) ?? false;

  return (
    <nav
      className="pointer-events-none fixed inset-x-3 bottom-3 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label={t("nav.mobile")}
    >
      <div className="pointer-events-auto mx-auto flex max-w-lg items-end rounded-2xl border border-zinc-200/90 bg-white/95 px-1 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <div className="flex flex-1 items-stretch">
          {leftItems.map((item) => (
            <TabLink
              key={item.href}
              item={item}
              active={item.match(pathname)}
            />
          ))}
        </div>

        {centerItem && (
          <div className="relative flex w-20 shrink-0 flex-col items-center">
            <Link
              href={centerItem.href}
              prefetch
              aria-label={t(centerItem.messageKey)}
              aria-current={centerActive ? "page" : undefined}
              className={`absolute -top-7 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 ${
                centerActive
                  ? "bg-yellow-400 text-zinc-900 shadow-amber-900/30 ring-4 ring-yellow-100"
                  : "bg-yellow-400 text-zinc-900 shadow-amber-900/25 hover:bg-yellow-300"
              }`}
            >
              <Shirt className="h-9 w-9" strokeWidth={2.25} aria-hidden />
            </Link>
            <span
              className={`pb-2 pt-9 text-xs font-bold ${
                centerActive ? "text-blue-600" : "text-zinc-400"
              }`}
            >
              {t(centerItem.messageKey)}
            </span>
          </div>
        )}

        <div className="flex flex-1 items-stretch">
          {rightItems.map((item) => (
            <TabLink
              key={item.href}
              item={item}
              active={item.match(pathname)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
