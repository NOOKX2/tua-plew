"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MessageCircle, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/lib/i18n/client";

const tabs = [
  {
    href: "/community",
    messageKey: "community.social.nav.events" as const,
    Icon: CalendarDays,
  },
  {
    href: "/community/friends",
    messageKey: "community.social.nav.friends" as const,
    Icon: Users,
  },
  {
    href: "/chat",
    messageKey: "community.social.nav.messages" as const,
    Icon: MessageCircle,
  },
];

function isChatPath(pathname: string) {
  return (
    pathname.startsWith("/chat") ||
    pathname.startsWith("/community/messages") ||
    /\/community\/[^/]+\/chat$/.test(pathname)
  );
}

export default function CommunitySocialNav({
  className = "mb-6",
}: {
  className?: string;
}) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => {
        const active =
          tab.href === "/community"
            ? pathname === "/community"
            : tab.href === "/chat"
              ? isChatPath(pathname)
              : pathname.startsWith(tab.href);

        const { Icon } = tab;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-blue-600 text-white"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
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
      className={`relative shrink-0 overflow-hidden rounded-full bg-blue-50 ring-2 ring-white ${sizeClass}`}
    >
      {image ? (
        <Image src={image} alt="" fill className="object-cover" sizes="44px" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-blue-700">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
