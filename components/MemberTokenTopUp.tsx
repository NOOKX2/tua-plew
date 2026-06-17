"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/client";
import { TOP_UP_PACKAGES } from "@/lib/top-up-packages";

export default function MemberTokenTopUp() {
  const t = useTranslations();

  return (
    <div className="border-t border-amber-100/80 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            {t("rental.tokens.topUpTitle")}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{t("rental.tokens.topUpNote")}</p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-amber-100">
          Demo
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {TOP_UP_PACKAGES.map((amount) => (
          <Link
            key={amount}
            href={`/member/tokens/top-up/${amount}`}
            className="rounded-xl border border-amber-200/80 bg-white px-2 py-3 text-center transition-colors hover:border-amber-400 hover:bg-amber-50"
          >
            <p className="text-lg font-bold text-zinc-900">{amount}</p>
            <p className="mt-0.5 text-[10px] font-medium text-zinc-500">
              ฿{amount}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-amber-700">
              {t("rental.tokens.topUpBuy")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
