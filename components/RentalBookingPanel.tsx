"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Coins, CreditCard, Sparkles } from "lucide-react";
import type { ProductAvailability } from "@/lib/locations";
import type { Product } from "@/lib/types";
import { createRentalReservationAction } from "@/lib/actions/rentals";
import { getRentalTokenBalanceAction } from "@/lib/actions/rental-tokens";
import { getSubscriptionStatusAction } from "@/lib/actions/subscription";
import type { SubscriptionStatus } from "@/lib/subscription";
import { useTranslations } from "@/lib/i18n/client";
import { useUser } from "./UserProvider";

type PaymentMode = "subscription" | "tokens" | "cash";

type Props = {
  product: Product;
  availability: ProductAvailability[];
  fixedLocationId?: string;
  compact?: boolean;
  callbackUrl?: string;
};

export default function RentalBookingPanel({
  product,
  availability,
  fixedLocationId,
  compact = false,
  callbackUrl,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { isAuthenticated, isLoading: isUserLoading } = useUser();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    fixedLocationId ?? null,
  );
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenCost = product.pricePerRental;
  const hasSubscriptionCredit =
    subscriptionStatus?.isActive && (subscriptionStatus.remaining ?? 0) > 0;
  const hasEnoughTokens =
    tokenBalance !== null && tokenBalance >= tokenCost && tokenCost > 0;

  const fixedAvailability = useMemo(
    () => availability.find((item) => item.location.id === fixedLocationId),
    [availability, fixedLocationId],
  );

  const sizeOptions = useMemo(() => {
    if (fixedAvailability) {
      return product.sizes.filter(
        (size) => (fixedAvailability.stock.inventory[size] ?? 0) > 0,
      );
    }
    return product.sizes.filter((size) =>
      availability.some((item) => (item.stock.inventory[size] ?? 0) > 0),
    );
  }, [fixedAvailability, product.sizes, availability]);

  const locationsForSize = useMemo(() => {
    if (!selectedSize) return [];
    return availability.filter(
      (item) => (item.stock.inventory[selectedSize] ?? 0) > 0,
    );
  }, [availability, selectedSize]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    Promise.all([
      getRentalTokenBalanceAction(),
      getSubscriptionStatusAction(),
    ]).then(([tokenResult, subscriptionResult]) => {
      if (cancelled) return;

      if (tokenResult.ok) {
        setTokenBalance(tokenResult.data.balance);
      }

      if (subscriptionResult.ok) {
        setSubscriptionStatus(subscriptionResult.data);
        if (subscriptionResult.data.isActive && subscriptionResult.data.remaining > 0) {
          setPaymentMode("subscription");
          return;
        }
      }

      if (tokenResult.ok && tokenResult.data.balance >= tokenCost && tokenCost > 0) {
        setPaymentMode("tokens");
      } else {
        setPaymentMode("cash");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, tokenCost]);

  useEffect(() => {
    if (paymentMode === "subscription" && !hasSubscriptionCredit) {
      setPaymentMode(hasEnoughTokens ? "tokens" : "cash");
    }
    if (paymentMode === "tokens" && !hasEnoughTokens) {
      setPaymentMode("cash");
    }
  }, [paymentMode, hasEnoughTokens, hasSubscriptionCredit]);

  useEffect(() => {
    if (fixedLocationId) return;
    if (!selectedSize) {
      setSelectedLocationId(null);
      return;
    }
    if (locationsForSize.length === 1) {
      setSelectedLocationId(locationsForSize[0].location.id);
      return;
    }
    if (
      selectedLocationId &&
      !locationsForSize.some((item) => item.location.id === selectedLocationId)
    ) {
      setSelectedLocationId(null);
    }
  }, [selectedSize, locationsForSize, fixedLocationId, selectedLocationId]);

  const loginHref = `/login?callbackUrl=${encodeURIComponent(
    callbackUrl ?? `/products/${product.id}`,
  )}`;

  const detailsReady = Boolean(selectedSize && selectedLocationId);
  const canProceed =
    detailsReady &&
    (paymentMode === "cash" ||
      (paymentMode === "tokens" && hasEnoughTokens) ||
      (paymentMode === "subscription" && hasSubscriptionCredit));

  async function handleProceed() {
    if (!selectedSize || !selectedLocationId || !canProceed) return;

    setError(null);
    setLoading(true);

    if (paymentMode === "cash") {
      const params = new URLSearchParams({
        productId: product.id,
        locationId: selectedLocationId,
        size: selectedSize,
      });
      router.push(`/rentals/reserve/pay?${params.toString()}`);
      setLoading(false);
      return;
    }

    const result = await createRentalReservationAction({
      productId: product.id,
      locationId: selectedLocationId,
      size: selectedSize,
      paymentMethod: paymentMode === "subscription" ? "subscription" : "tokens",
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(`/rentals/checkout/${result.data.rental.id}`);
    router.refresh();
  }

  if (isUserLoading) {
    return (
      <div
        className={`rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 ${
          compact ? "mt-3" : "mt-6"
        }`}
        aria-hidden
      >
        <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-3 w-full max-w-xs animate-pulse rounded bg-zinc-200/80" />
        <div className="mt-3 h-10 w-full animate-pulse rounded-xl bg-zinc-200/70" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className={`rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 ${
          compact ? "mt-3" : "mt-6"
        }`}
      >
        <p className="text-sm font-semibold text-zinc-900">{t("rental.title")}</p>
        <p className="mt-1 text-xs text-zinc-500">{t("rental.loginPrompt")}</p>
        <Link
          href={loginHref}
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {t("rental.loginToReserve")}
        </Link>
      </div>
    );
  }

  if (sizeOptions.length === 0) {
    return (
      <p className={`text-xs text-red-500 ${compact ? "mt-3" : "mt-6"}`}>
        {t("rental.errors.outOfStock")}
      </p>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-blue-200/80 bg-white p-4 shadow-sm ${
        compact ? "mt-3" : "mt-6"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{t("rental.title")}</p>
          <p className="mt-1 text-xs text-zinc-500">{t("rental.subtitle")}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {hasSubscriptionCredit && subscriptionStatus?.plan && (
            <div className="flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-800 ring-1 ring-violet-100">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {t("subscription.remaining", {
                remaining: subscriptionStatus.remaining,
              })}
            </div>
          )}
          {tokenBalance !== null && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
              <Coins className="h-3.5 w-3.5" aria-hidden />
              {tokenBalance}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-zinc-600">
          {t("rental.selectSize")}
        </p>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => {
            const active = selectedSize === size;
            const disabled = fixedAvailability
              ? (fixedAvailability.stock.inventory[size] ?? 0) < 1
              : !availability.some(
                  (item) => (item.stock.inventory[size] ?? 0) > 0,
                );

            return (
              <button
                key={size}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setSelectedSize(size);
                  if (!fixedLocationId) setSelectedLocationId(null);
                }}
                className={`min-w-11 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : disabled
                      ? "cursor-not-allowed bg-zinc-100 text-zinc-300"
                      : "bg-zinc-100 text-zinc-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {selectedSize && !fixedLocationId && (
        <div className="mt-4">
          <label
            htmlFor={`rental-location-${product.id}`}
            className="mb-2 block text-xs font-medium text-zinc-600"
          >
            {t("rental.selectLocation")}
          </label>
          <select
            id={`rental-location-${product.id}`}
            value={selectedLocationId ?? ""}
            onChange={(e) => setSelectedLocationId(e.target.value || null)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">{t("rental.chooseLocation")}</option>
            {locationsForSize.map((item) => (
              <option key={item.location.id} value={item.location.id}>
                {item.location.name} — {item.location.address}
              </option>
            ))}
          </select>
        </div>
      )}

      {fixedAvailability && selectedSize && (
        <p className="mt-3 text-xs text-zinc-500">
          {t("rental.pickupAt", { name: fixedAvailability.location.name })}
        </p>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-zinc-600">
          {t("rental.selectPayment")}
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setPaymentMode("subscription")}
            disabled={!hasSubscriptionCredit}
            className={`rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
              paymentMode === "subscription"
                ? "border-violet-500 bg-violet-50 text-violet-900 ring-1 ring-violet-500/20"
                : hasSubscriptionCredit
                  ? "border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 hover:bg-white"
                  : "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400"
            }`}
          >
            <p className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
              {t("rental.payWithSubscription")}
            </p>
            <p className="mt-1 text-xs opacity-80">
              {hasSubscriptionCredit && subscriptionStatus
                ? t("subscription.planCredit")
                : t("subscription.subscribeCta")}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode("tokens")}
            disabled={!hasEnoughTokens}
            className={`rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
              paymentMode === "tokens"
                ? "border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500/20"
                : hasEnoughTokens
                  ? "border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 hover:bg-white"
                  : "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400"
            }`}
          >
            <p className="flex items-center gap-2 font-semibold">
              <Coins className="h-4 w-4 shrink-0" aria-hidden />
              {t("rental.payWithTokens")}
            </p>
            <p className="mt-1 text-xs opacity-80">
              {t("rental.tokenCost", { count: tokenCost })}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode("cash")}
            className={`rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
              paymentMode === "cash"
                ? "border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600/20"
                : "border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 hover:bg-white"
            }`}
          >
            <p className="flex items-center gap-2 font-semibold">
              <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
              {t("rental.payWithNormal")}
            </p>
            <p className="mt-1 text-xs opacity-80">฿{tokenCost}</p>
          </button>
        </div>

        {!hasSubscriptionCredit && (
          <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/60 px-3.5 py-3">
            <p className="text-xs font-medium text-violet-900">
              {t("subscription.noPlan")}
            </p>
            <Link
              href="/member/subscribe"
              className="mt-2 inline-flex text-xs font-semibold text-violet-700 hover:text-violet-800"
            >
              {t("subscription.subscribeCta")} →
            </Link>
          </div>
        )}

        {paymentMode === "tokens" && !hasEnoughTokens && tokenBalance !== null && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-3">
            <p className="text-xs font-medium text-amber-900">
              {t("rental.tokens.needMore", {
                need: tokenCost,
                have: tokenBalance,
              })}
            </p>
            <Link
              href="/member"
              className="mt-2 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {t("rental.tokens.topUpTitle")} →
            </Link>
          </div>
        )}

        <p className="mt-2 text-[11px] text-zinc-400">{t("rental.tokenRate")}</p>
      </div>

      <button
        type="button"
        disabled={!canProceed || loading}
        onClick={handleProceed}
        className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? t("rental.reserving")
          : paymentMode === "cash"
            ? t("rental.continueToPayment")
            : t("rental.reserve")}
      </button>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <p className="mt-2 text-center text-[11px] leading-relaxed text-zinc-400">
        {paymentMode === "subscription"
          ? t("subscription.paidWithPlan")
          : paymentMode === "tokens"
            ? t("rental.paidWithTokens", { count: tokenCost })
            : t("rental.payment.cashHint")}
      </p>
    </div>
  );
}
