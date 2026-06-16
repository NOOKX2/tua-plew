"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/lib/i18n/client";

const tabs = [
  { href: "/community", messageKey: "community.social.nav.events" as const },
  { href: "/community/friends", messageKey: "community.social.nav.friends" as const },
  { href: "/chat", messageKey: "community.social.nav.messages" as const },
];

export default function CommunitySocialNav() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active =
          tab.href === "/community"
            ? pathname === "/community"
            : tab.href === "/chat"
              ? pathname.startsWith("/chat") ||
                pathname.startsWith("/community/messages") ||
                /\/community\/[^/]+\/chat$/.test(pathname)
              : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-emerald-600 text-white"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {t(tab.messageKey)}
          </Link>
        );
      })}
    </div>
  );
}

export function UserAvatar({
  name,
  image,
  size = "md",
}: {
  name: string;
  image?: string;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-emerald-50 ring-2 ring-white ${sizeClass}`}
    >
      {image ? (
        <Image src={image} alt="" fill className="object-cover" sizes="44px" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-emerald-700">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
