import Link from "next/link";
import { ChevronRight, History } from "lucide-react";
import MemberTokenTopUp from "./MemberTokenTopUp";
import { getTranslator } from "@/lib/i18n/server";

type Props = {
  balance: number;
};

export default async function MemberTokenSection({ balance }: Props) {
  const t = await getTranslator();

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200/80 bg-linear-to-br from-amber-50 via-white to-orange-50/40 shadow-sm">
      <div className="border-b border-amber-100/80 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700/80">
          {t("rental.tokens.title")}
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="text-3xl font-bold tracking-tight text-zinc-900">
            {balance}
            <span className="ml-2 text-sm font-semibold text-zinc-500">
              {t("member.tokenUnit")}
            </span>
          </p>
          <p className="text-right text-[11px] text-zinc-500">{t("rental.tokenRate")}</p>
        </div>
      </div>

      <div className="border-b border-amber-100/80 px-5 py-3">
        <Link
          href="/member/tokens/history"
          className="group flex items-center gap-3 rounded-xl px-1 py-2 transition-colors hover:bg-white/60"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 ring-1 ring-amber-100">
            <History className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-900">
              {t("rental.tokens.viewHistory")}
            </p>
            <p className="text-xs text-zinc-500">
              {t("rental.tokens.viewHistoryHint")}
            </p>
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400"
            aria-hidden
          />
        </Link>
      </div>

      <MemberTokenTopUp />
    </section>
  );
}
