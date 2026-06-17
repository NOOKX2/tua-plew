import type { RentalTokenTransaction } from "@/lib/types";
import { formatTokenTransactionDate } from "@/lib/token-transaction-display";
import { getTranslator } from "@/lib/i18n/server";

type Translator = Awaited<ReturnType<typeof getTranslator>>;

function transactionLabel(
  type: RentalTokenTransaction["type"],
  t: Translator,
) {
  switch (type) {
    case "welcome":
      return t("rental.tokens.welcome");
    case "spend":
      return t("rental.tokens.spend");
    case "refund":
      return t("rental.tokens.refund");
    case "earn":
      return t("rental.tokens.earn");
    case "topup":
      return t("rental.tokens.topup");
    default:
      return type;
  }
}

type Props = {
  transactions: RentalTokenTransaction[];
  locale: "th" | "en";
};

export default async function TokenTransactionList({
  transactions,
  locale,
}: Props) {
  const t = await getTranslator();

  if (transactions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-500">
        {t("rental.tokens.emptyActivity")}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
      {transactions.map((tx) => (
        <li
          key={tx.id}
          className="flex items-center justify-between gap-3 px-4 py-3.5"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-800">
              {transactionLabel(tx.type, t)}
            </p>
            <p className="text-[11px] text-zinc-400">
              {formatTokenTransactionDate(tx.createdAt, locale)}
            </p>
          </div>
          <span
            className={`shrink-0 text-sm font-bold tabular-nums ${
              tx.amount >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {tx.amount >= 0 ? "+" : ""}
            {tx.amount}
          </span>
        </li>
      ))}
    </ul>
  );
}
