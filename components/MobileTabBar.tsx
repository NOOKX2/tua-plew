"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAuthRoute, mainNavItems } from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n/client";

function HomeIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5L12 3l9 7.5M5 9.75V20a1 1 0 001 1h4v-5.5a1 1 0 011-1h2a1 1 0 011 1V21h4a1 1 0 001-1V9.75"
      />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h8M8 14h5M21 12c0 3.866-3.582 7-8 7-.847 0-1.658-.12-2.4-.34L5 20l1.34-4.6A6.96 6.96 0 015 12c0-3.866 3.582-7 8-7s8 3.134 8 7z"
      />
    </svg>
  );
}

function CampaignIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
      />
    </svg>
  );
}

function RentalIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  );
}

const icons = [
  HomeIcon,
  CommunityIcon,
  ChatIcon,
  CampaignIcon,
  RentalIcon,
] as const;

export default function MobileTabBar() {
  const pathname = usePathname();
  const t = useTranslations();

  if (isAuthRoute(pathname)) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label={t("nav.mobile")}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        {mainNavItems.map((item, index) => {
          const active = item.match(pathname);
          const Icon = icons[index];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 px-0.5 transition-colors ${
                active ? "text-white" : "text-zinc-500"
              }`}
            >
              <span
                className={`absolute inset-x-2 top-0 h-0.5 rounded-full transition-opacity ${
                  active ? "bg-white opacity-100" : "opacity-0"
                }`}
              />
              <Icon />
              <span className="max-w-full truncate text-[8px] font-semibold uppercase tracking-wide sm:text-[9px]">
                {t(item.messageKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
