"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Product, RentalReservation } from "@/lib/types";
import { isReservationActive } from "@/lib/rental-status";
import { cancelRentalReservationAction } from "@/lib/actions/rentals";
import { useLocale, useTranslations } from "@/lib/i18n/client";

type Props = {
  initialRentals: RentalReservation[];
  productsById: Record<string, Product>;
};

function StatCard({
  label,
  value,
  unit,
  variant = "light",
}: {
  label: string;
  value: number;
  unit: string;
  variant?: "accent" | "light";
}) {
  const isAccent = variant === "accent";

  return (
    <div
      className={`rounded-2xl px-5 py-5 shadow-lg ring-1 sm:px-6 sm:py-6 ${isAccent
          ? "bg-gradient-to-br from-blue-50/80 via-white to-white text-zinc-900 shadow-blue-900/5 ring-blue-200/70"
          : "bg-white text-zinc-900 shadow-zinc-900/5 ring-zinc-200/80"
        }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        {label}
      </p>
      <p
        className={`mt-2 text-4xl font-bold tracking-tight sm:text-5xl ${isAccent ? "text-blue-600" : "text-zinc-900"
          }`}
      >
        {value}
        <span className="ml-1.5 text-sm font-medium text-zinc-500">
          {unit}
        </span>
      </p>
    </div>
  );
}

export default function MyRentalsList({
  initialRentals,
  productsById,
}: Props) {
  const t = useTranslations();
  const { locale } = useLocale();
  const router = useRouter();
  const [rentals, setRentals] = useState(initialRentals);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"active" | "all">("active");

  const activeRentals = useMemo(
    () => rentals.filter(isReservationActive),
    [rentals],
  );

  const displayed = tab === "active" ? activeRentals : rentals;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString(locale === "th" ? "th-TH" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function statusLabel(status: RentalReservation["status"]) {
    return t(`rental.status.${status}`);
  }

  function paymentLabel(rental: RentalReservation) {
    if (rental.paymentMethod === "subscription") {
      return t("subscription.paidWithPlan");
    }
    if (rental.paymentMethod === "tokens" && rental.tokensSpent > 0) {
      return t("rental.paidWithTokens", { count: rental.tokensSpent });
    }
    if (rental.paymentMethod === "mixed" && rental.tokensSpent > 0) {
      return t("rental.mixedPaymentSummary", {
        tokens: rental.tokensSpent,
        cash: rental.price - rental.tokensSpent,
      });
    }
    return null;
  }

  async function handleCancel(id: string) {
    setError(null);
    setCancellingId(id);

    const result = await cancelRentalReservationAction(id);

    setCancellingId(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setRentals((prev) =>
      prev.map((rental) =>
        rental.id === id ? result.data.rental : rental,
      ),
    );
    router.refresh();
  }

  if (rentals.length === 0) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white p-12 text-center shadow-xl shadow-zinc-900/5 sm:p-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-2xl">
          📦
        </div>
        <p className="mt-6 text-base font-medium text-zinc-700">
          {t("rental.empty")}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
        >
          {t("rental.browseProducts")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          label={t("rental.activeTab")}
          value={activeRentals.length}
          unit={t("common.pieces")}
          variant="accent"
        />
        <StatCard
          label={t("rental.historyTab")}
          value={rentals.length}
          unit={t("common.pieces")}
        />
      </div>

      <div className="flex gap-1.5 rounded-full border border-zinc-200/80 bg-white p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("active")}
          className={`flex-1 rounded-full px-4 py-2.5 text-xs font-bold transition-all ${tab === "active"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-zinc-500 hover:text-zinc-800"
            }`}
        >
          {t("rental.activeTab")}
          {activeRentals.length > 0 && (
            <span
              className={`ml-1.5 ${tab === "active" ? "text-blue-100" : "text-blue-600"}`}
            >
              ({activeRentals.length})
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`flex-1 rounded-full px-4 py-2.5 text-xs font-bold transition-all ${tab === "all"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-zinc-500 hover:text-zinc-800"
            }`}
        >
          {t("rental.historyTab")}
        </button>
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 px-5 py-3.5 text-sm text-red-700 ring-1 ring-red-100">
          {error}
        </p>
      )}

      {displayed.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-zinc-200 bg-white/80 p-10 text-center backdrop-blur-sm">
          <p className="text-sm text-zinc-500">{t("rental.empty")}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {displayed.map((rental) => {
            const isActive = isReservationActive(rental);
            const product = productsById[rental.productId];

            return (
              <article
                key={rental.id}
                className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5"
              >
                <div
                  className={`grid ${isActive ? "lg:grid-cols-[minmax(0,240px)_1fr]" : ""}`}
                >
                  {product && (
                    <div
                      className={`relative overflow-hidden ${isActive
                          ? "bg-gradient-to-br from-zinc-100 via-white to-blue-50/50 p-6 lg:p-8"
                          : "flex items-center gap-4 border-b border-zinc-100 p-5 sm:px-6"
                        }`}
                    >
                      {isActive && (
                        <div className="home-hero-grid absolute inset-0 opacity-25" />
                      )}

                      <div
                        className={`relative shrink-0 overflow-hidden bg-white ring-1 ring-zinc-200/80 ${isActive
                            ? "mx-auto aspect-square w-full max-w-[200px] rounded-[1.25rem] shadow-lg"
                            : "h-16 w-16 rounded-xl"
                          }`}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-2 sm:p-3"
                          sizes={isActive ? "200px" : "64px"}
                        />
                      </div>

                      {!isActive && (
                        <div className="min-w-0 flex-1">
                          <h2 className="font-bold tracking-tight text-zinc-900">
                            {rental.productName}
                          </h2>
                          <p className="mt-0.5 text-sm text-zinc-500">
                            {rental.locationName} · {t("product.size")}{" "}
                            <span className="font-semibold text-zinc-800">
                              {rental.size}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col p-5 sm:p-6 lg:p-8">
                    {isActive && (
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                            {rental.productName}
                          </h2>
                          <p className="mt-1 text-sm text-zinc-500">
                            {rental.locationName} · {t("product.size")}{" "}
                            <span className="font-semibold text-zinc-800">
                              {rental.size}
                            </span>
                          </p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                          {statusLabel(rental.status)}
                        </span>
                      </div>
                    )}

                    {!isActive && (
                      <div className="mb-4 flex justify-end">
                        <span className="rounded-full bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-600">
                          {statusLabel(rental.status)}
                        </span>
                      </div>
                    )}

                    {isActive && (
                      <div className="relative mb-6 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-blue-50 via-white to-teal-50/60 px-6 py-7 text-center ring-1 ring-blue-200/80">
                        <div className="home-hero-grid absolute inset-0 opacity-[0.05]" />
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-200/30 blur-2xl" />

                        <p className="relative text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                          {t("rental.pickupCode")}
                        </p>
                        <p className="relative mt-2 font-mono text-[2.5rem] font-bold leading-none tracking-[0.22em] text-blue-700 sm:text-5xl">
                          {rental.pickupCode}
                        </p>
                        <p className="relative mt-3 text-xs text-amber-700/80">
                          {t("rental.pickupBy")} {formatDate(rental.expiresAt)}
                        </p>
                      </div>
                    )}

                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                      <div className="rounded-xl bg-zinc-50/80 px-4 py-3 ring-1 ring-zinc-100">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                          {t("rental.location")}
                        </dt>
                        <dd className="mt-1.5 font-medium leading-snug text-zinc-900">
                          {rental.locationAddress}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-zinc-50/80 px-4 py-3 ring-1 ring-zinc-100">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                          {t("rental.price")}
                        </dt>
                        <dd className="mt-1.5 text-lg font-bold text-zinc-900">
                          ฿{rental.price}
                          <span className="text-sm font-medium text-zinc-500">
                            {t("common.perRental")}
                          </span>
                          {paymentLabel(rental) && (
                            <span className="mt-1 block text-xs font-medium text-violet-700">
                              {paymentLabel(rental)}
                            </span>
                          )}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-zinc-50/80 px-4 py-3 ring-1 ring-zinc-100 sm:col-span-2">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                          {t("rental.reservedAt")}
                        </dt>
                        <dd className="mt-1.5 text-zinc-700">
                          {formatDate(rental.reservedAt)}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-2.5 border-t border-zinc-100 pt-5">
                      {isActive && (
                        <Link
                          href={`/map?product=${rental.productId}&location=${rental.locationId}`}
                          className="inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700"
                        >
                          {t("common.viewOnMap")}
                        </Link>
                      )}
                      <Link
                        href={`/products/${rental.productId}`}
                        className="inline-flex rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
                      >
                        {t("rental.viewProduct")}
                      </Link>
                      {!isActive && (
                        <Link
                          href={`/map?product=${rental.productId}&location=${rental.locationId}`}
                          className="inline-flex rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
                        >
                          {t("common.viewOnMap")}
                        </Link>
                      )}
                      {isActive && (
                        <button
                          type="button"
                          disabled={cancellingId === rental.id}
                          onClick={() => handleCancel(rental.id)}
                          className="inline-flex rounded-full border border-red-200/80 px-5 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                        >
                          {cancellingId === rental.id
                            ? t("rental.cancelling")
                            : t("rental.cancel")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
