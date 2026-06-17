import Image from "next/image";
import Link from "next/link";
import MemberSignOutButton from "./MemberSignOutButton";
import { getTranslator } from "@/lib/i18n/server";

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type Props = {
  user: User | null;
  activeRentals: number;
};

export default async function MemberPageContent({ user, activeRentals }: Props) {
  const t = await getTranslator();

  if (!user) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
          👤
        </div>
        <h2 className="text-lg font-bold text-zinc-900">
          {t("member.guestTitle")}
        </h2>
        <p className="mt-2 text-sm text-zinc-500">{t("member.guestSubtitle")}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/login?callbackUrl=/member"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            {t("member.login")}
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          >
            {t("member.register")}
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.name?.trim() || user.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const menuItems = [
    {
      href: "/rentals",
      label: t("member.myRentals"),
      hint:
        activeRentals > 0
          ? t("member.activeRentals", { count: activeRentals })
          : undefined,
      icon: "📦",
    },
    {
      href: "/community/friends",
      label: t("member.friends"),
      icon: "👥",
    },
    {
      href: "/chat",
      label: t("member.chat"),
      icon: "💬",
    },
    {
      href: "/campaigns",
      label: t("member.campaigns"),
      icon: "📣",
    },
    {
      href: "/rentals/shop",
      label: t("member.rentShop"),
      icon: "👕",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          {user.image ? (
            <Image
              src={user.image}
              alt={displayName}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full ring-2 ring-blue-100"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
              {initial}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-zinc-900">
              {displayName}
            </h2>
            {user.email && (
              <p className="truncate text-sm text-zinc-500">{user.email}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40"
          >
            <span className="text-xl" aria-hidden>
              {item.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-zinc-900">{item.label}</p>
              {item.hint && (
                <p className="text-xs text-blue-600">{item.hint}</p>
              )}
            </div>
            <span className="text-zinc-300" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>

      <MemberSignOutButton />
    </div>
  );
}
