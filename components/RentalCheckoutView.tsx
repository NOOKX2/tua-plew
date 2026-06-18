import Link from "next/link";
import type { RentalReservation } from "@/lib/types";
import type { RentalCheckoutPeer } from "@/lib/rental-checkout";
import { getTranslator } from "@/lib/i18n/server";
import { UserAvatar } from "./CommunitySocialNav";

type Props = {
  rental: RentalReservation;
  peers: RentalCheckoutPeer[];
  currentUserId: string;
  locale: "th" | "en";
};

function formatDateTime(iso: string, locale: "th" | "en") {
  return new Date(iso).toLocaleString(locale === "th" ? "th-TH" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function DetailRow({
  label,
  value,
  valueClassName = "text-zinc-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 py-3.5 last:border-0 last:pb-0 first:pt-0">
      <dt className="shrink-0 text-sm text-zinc-500">{label}</dt>
      <dd className={`text-right text-sm font-semibold ${valueClassName}`}>
        {value}
      </dd>
    </div>
  );
}

export default async function RentalCheckoutView({
  rental,
  peers,
  currentUserId,
  locale,
}: Props) {
  const t = await getTranslator();
  const isSubscription = rental.paymentMethod === "subscription";
  const paidWithTokens = rental.tokensSpent > 0;
  const isMixed = rental.paymentMethod === "mixed";
  const cashDue = rental.price - rental.tokensSpent;

  function paymentSummary() {
    if (isSubscription) {
      return t("subscription.paidWithPlan");
    }
    if (rental.paymentMethod === "tokens") {
      return t("rental.paidWithTokens", { count: rental.tokensSpent });
    }
    if (isMixed) {
      return t("rental.mixedPaymentSummary", {
        tokens: rental.tokensSpent,
        cash: cashDue,
      });
    }
    return t("rental.payWithCash");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
          <svg
            aria-hidden
            className="h-7 w-7 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
          {t("rental.confirmed")}
        </h1>
        <p className="mt-1 max-w-xs text-sm text-zinc-500">
          {t("rental.pickupInstructions")}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-linear-to-br from-zinc-900 via-blue-950 to-blue-900 p-6 text-white shadow-xl shadow-blue-950/20">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200/80">
            {t("rental.pickupCode")}
          </p>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-100 ring-1 ring-white/10">
            {rental.productName}
          </span>
        </div>
        <p className="mt-4 text-center font-mono text-4xl font-bold tracking-[0.28em] text-white sm:text-[2.75rem]">
          {rental.pickupCode}
        </p>
        <p className="mt-4 text-center text-xs leading-relaxed text-blue-100/80">
          {isSubscription
            ? t("subscription.paidWithPlan")
            : paidWithTokens
              ? isMixed
                ? t("rental.mixedPaymentSummary", {
                    tokens: rental.tokensSpent,
                    cash: cashDue,
                  })
                : t("rental.paidWithTokens", { count: rental.tokensSpent })
              : t("rental.payment.paidOnlineShort", { amount: rental.price })}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {t("rental.checkout.orderDetails")}
        </h2>
        <dl>
          <DetailRow
            label={t("rental.location")}
            value={rental.locationName}
          />
          <DetailRow label={t("product.size")} value={rental.size} />
          <DetailRow
            label={t("rental.price")}
            value={`฿${rental.price}${t("common.perRental")}`}
          />
          <DetailRow
            label={t("rental.selectPayment")}
            value={paymentSummary()}
            valueClassName={
              isSubscription
                ? "text-violet-700"
                : paidWithTokens
                  ? "text-amber-700"
                  : "text-zinc-900"
            }
          />
          {isMixed && (
            <DetailRow
              label={t("rental.cashDueAtPickup")}
              value={`฿${cashDue}`}
              valueClassName="text-blue-700"
            />
          )}
          <DetailRow
            label={t("rental.pickupBy")}
            value={formatDateTime(rental.expiresAt, locale)}
            valueClassName="text-amber-700"
          />
        </dl>
      </div>

      {isSubscription ? (
        <div className="rounded-2xl border border-violet-200/80 bg-violet-50/80 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-violet-900">
            {t("subscription.paidWithPlan")}
          </p>
          <p className="mt-1 text-xs text-violet-800/80">
            {t("subscription.planCredit")}
          </p>
        </div>
      ) : paidWithTokens ? (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-amber-900">{paymentSummary()}</p>
          <p className="mt-1 text-xs text-amber-800/80">{t("rental.tokenRate")}</p>
          {isMixed && (
            <p className="mt-2 text-xs font-medium text-blue-700">
              {t("rental.cashDueAtPickup")}: ฿{cashDue}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-emerald-900">
            {t("rental.payment.paidOnline", { amount: rental.price })}
          </p>
          <p className="mt-1 text-xs text-emerald-800/80">
            {t("rental.checkout.payment.mockNote")}
          </p>
        </div>
      )}

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              {t("rental.checkout.peersTitle")}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">
              {t("rental.checkout.peersSubtitle", {
                product: rental.productName,
                location: rental.locationName,
              })}
            </p>
          </div>
          {peers.length > 0 && (
            <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
              {peers.length}
            </span>
          )}
        </div>

        {peers.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-500">
            {t("rental.checkout.peersEmpty")}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100">
            {peers.map((peer) => {
              const isSelf = peer.userId === currentUserId;
              return (
                <li
                  key={`${peer.userId}-${peer.size}-${peer.reservedAt}`}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar
                      name={peer.name}
                      image={peer.image}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {peer.name}
                        {isSelf && (
                          <span className="ml-1.5 text-xs font-medium text-blue-600">
                            ({t("rental.checkout.you")})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {t("rental.checkout.sizeLabel")}{" "}
                        <span className="font-medium text-zinc-700">
                          {peer.size}
                        </span>
                      </p>
                    </div>
                  </div>
                  <time
                    dateTime={peer.reservedAt}
                    className="shrink-0 text-[11px] tabular-nums text-zinc-400"
                  >
                    {formatDateTime(peer.reservedAt, locale)}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="flex gap-2.5 pt-1">
        <Link
          href={`/products/${rental.productId}`}
          className="flex flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          {t("rental.checkout.viewProductShort")}
        </Link>
        <Link
          href="/rentals"
          className="flex flex-[1.35] items-center justify-center gap-1 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-500"
        >
          {t("rental.checkout.viewRentalsShort")}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
