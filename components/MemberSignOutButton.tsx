"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "@/lib/i18n/client";

export default function MemberSignOutButton() {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
    >
      {t("auth.logout")}
    </button>
  );
}
