import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Megaphone,
  MessageCircle,
  Package,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MemberTokenSection from "./MemberTokenSection";
import MemberSubscriptionSection from "./MemberSubscriptionSection";
import { getTranslator } from "@/lib/i18n/server";
import type { SubscriptionStatus } from "@/lib/subscription";

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type Props = {
  user: User | null;
  activeRentals: number;
  showAdmin?: boolean;
  tokenBalance?: number;
  subscriptionStatus?: SubscriptionStatus;
};

type MenuItem = {
  href: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  accent?: "blue" | "amber" | "violet";
};

function MenuIcon({
  icon: Icon,
  accent = "blue",
}: {
  icon: LucideIcon;
  accent?: MenuItem["accent"];
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-600 ring-blue-500/10",
    amber: "bg-amber-500/10 text-amber-700 ring-amber-500/10",
    violet: "bg-violet-500/10 text-violet-700 ring-violet-500/10",
  };

  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${styles[accent]}`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
    </span>
  );
}

export default async function MemberPageContent({
  user,
  activeRentals,
  showAdmin = false,
  tokenBalance = 0,
  subscriptionStatus,
}: Props) {
  const t = await getTranslator();

  if (!user) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-sm">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-zinc-100 to-zinc-50 ring-1 ring-zinc-200/80">
            <Users className="h-9 w-9 text-zinc-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            {t("member.guestTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">
            {t("member.guestSubtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login?callbackUrl=/member"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition-colors hover:bg-zinc-800"
            >
              {t("member.login")}
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            >
              {t("member.register")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.name?.trim() || user.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const menuItems: MenuItem[] = [
    {
      href: "/rentals",
      label: t("member.myRentals"),
      hint:
        activeRentals > 0
          ? t("member.activeRentals", { count: activeRentals })
          : undefined,
      icon: Package,
    },
    {
      href: "/community/friends",
      label: t("member.friends"),
      icon: Users,
    },
    {
      href: "/chat",
      label: t("member.chat"),
      icon: MessageCircle,
    },
    {
      href: "/campaigns",
      label: t("member.campaigns"),
      icon: Megaphone,
      accent: "amber",
    },
    ...(showAdmin
      ? [
          {
            href: "/admin",
            label: t("member.adminPanel"),
            icon: Settings,
            accent: "violet" as const,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-zinc-900 via-zinc-900 to-blue-950 p-6 shadow-xl shadow-zinc-900/20">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-blue-600/15 blur-3xl"
          aria-hidden
        />
        <div className="home-hero-grid pointer-events-none absolute inset-0 opacity-[0.04]" />

        <div className="relative">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-200 ring-1 ring-white/10">
            {t("member.memberBadge")}
          </span>

          <div className="mt-5 flex items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={72}
                height={72}
                className="h-18 w-18 rounded-2xl object-cover ring-2 ring-white/20"
              />
            ) : (
              <span className="flex h-18 w-18 items-center justify-center rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-900/30 ring-2 ring-white/20">
                {initial}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold tracking-tight text-white">
                {displayName}
              </h2>
              {user.email && (
                <p className="mt-1 truncate text-sm text-zinc-300">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {activeRentals > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-blue-100 ring-1 ring-white/10 backdrop-blur-sm">
              <Package className="h-3.5 w-3.5" aria-hidden />
              {t("member.activeRentals", { count: activeRentals })}
            </div>
          )}
        </div>
      </div>

      {subscriptionStatus ? (
        <MemberSubscriptionSection status={subscriptionStatus} />
      ) : null}

      <MemberTokenSection balance={tokenBalance} />

      <div>
        <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {t("member.accountMenu")}
        </p>
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3.5 px-4 py-4 transition-colors hover:bg-zinc-50/80 ${
                index > 0 ? "border-t border-zinc-100" : ""
              }`}
            >
              <MenuIcon icon={item.icon} accent={item.accent} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-zinc-900">{item.label}</p>
                {item.hint ? (
                  <p className="mt-0.5 text-xs font-medium text-blue-600">
                    {item.hint}
                  </p>
                ) : null}
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
