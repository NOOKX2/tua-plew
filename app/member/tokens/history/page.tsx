import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import TokenTransactionList from "@/components/TokenTransactionList";
import { auth } from "@/auth";
import { getRecentRentalTokenTransactions, getRentalTokenBalance } from "@/lib/rental-tokens";
import { getLocale, getTranslator } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("rental.tokens.historyMetaTitle"),
    description: t("rental.tokens.historySubtitle"),
  };
}

export default async function TokenHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=%2Fmember%2Ftokens%2Fhistory");
  }

  const [t, locale, balance, transactions] = await Promise.all([
    getTranslator(),
    getLocale(),
    getRentalTokenBalance(session.user.id),
    getRecentRentalTokenTransactions(session.user.id, 50),
  ]);

  return (
    <main className="relative flex-1 overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-blue-50/80 to-transparent" />

      <div className="relative mx-auto w-full max-w-md flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/member"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {t("rental.tokens.historyBack")}
        </Link>

        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700/80">
            {t("rental.tokens.title")}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
            {t("rental.tokens.historyTitle")}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {t("rental.tokens.historySubtitle")}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-200/80 bg-amber-50/50 px-4 py-3.5">
          <p className="text-xs font-medium text-amber-800/80">
            {t("rental.tokens.currentBalance")}
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">
            {balance}
            <span className="ml-2 text-sm font-semibold text-zinc-500">
              {t("member.tokenUnit")}
            </span>
          </p>
        </div>

        <div className="mt-6">
          <TokenTransactionList transactions={transactions} locale={locale} />
        </div>
      </div>
    </main>
  );
}
