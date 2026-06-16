"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import type { ProductAvailability } from "@/lib/locations";
import type { Product, RentalReservation } from "@/lib/types";
import { createRentalReservationAction } from "@/lib/actions/rentals";
import { useLocale, useTranslations } from "@/lib/i18n/client";

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
  const { locale } = useLocale();
  const router = useRouter();
  const { status } = useSession();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    fixedLocationId ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<RentalReservation | null>(
    null,
  );

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

  const canReserve = Boolean(selectedSize && selectedLocationId);

  function formatExpiry(iso: string) {
    return new Date(iso).toLocaleString(locale === "th" ? "th-TH" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  async function handleReserve() {
    if (!selectedSize || !selectedLocationId) return;

    setError(null);
    setLoading(true);

    const result = await createRentalReservationAction({
      productId: product.id,
      locationId: selectedLocationId,
      size: selectedSize,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setReservation(result.data.rental);
    router.refresh();
  }

  if (status === "loading") {
    return (
      <p className={`text-xs text-zinc-400 ${compact ? "" : "mt-6"}`}>
        {t("common.loading")}
      </p>
    );
  }

  if (reservation) {
    return (
      <div
        className={`rounded-2xl border border-blue-200 bg-blue-50/60 p-4 ${compact ? "mt-3" : "mt-6"
          }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
          {t("rental.confirmed")}
        </p>
        <p className="mt-1 text-sm text-zinc-600">{t("rental.pickupInstructions")}</p>

        <div className="mt-4 rounded-xl bg-white px-4 py-5 text-center ring-1 ring-blue-100">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            {t("rental.pickupCode")}
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tracking-[0.2em] text-blue-700">
            {reservation.pickupCode}
          </p>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">{t("rental.location")}</dt>
            <dd className="text-right font-medium text-zinc-900">
              {reservation.locationName}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">{t("product.size")}</dt>
            <dd className="font-medium text-zinc-900">{reservation.size}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">{t("rental.price")}</dt>
            <dd className="font-medium text-zinc-900">
              ฿{reservation.price}
              {t("common.perRental")}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">{t("rental.pickupBy")}</dt>
            <dd className="text-right font-medium text-amber-700">
              {formatExpiry(reservation.expiresAt)}
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          {t("rental.payAtPickup")}
        </p>

        <Link
          href="/rentals"
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {t("rental.viewMyRentals")}
        </Link>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div
        className={`rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 ${compact ? "mt-3" : "mt-6"
          }`}
      >
        <p className="text-sm font-semibold text-zinc-900">{t("rental.title")}</p>
        <p className="mt-1 text-xs text-zinc-500">{t("rental.loginPrompt")}</p>
        <Link
          href={loginHref}
          className={`mt-3 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 ${compact ? "" : ""
            }`}
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
      className={`rounded-2xl border border-blue-200/80 bg-white p-4 shadow-sm ${compact ? "mt-3" : "mt-6"
        }`}
    >
      <p className="text-sm font-semibold text-zinc-900">{t("rental.title")}</p>
      <p className="mt-1 text-xs text-zinc-500">{t("rental.subtitle")}</p>

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
                className={`min-w-[2.75rem] rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active
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

      <button
        type="button"
        disabled={!canReserve || loading}
        onClick={handleReserve}
        className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t("rental.reserving") : t("rental.reserve")}
      </button>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <p className="mt-2 text-center text-[11px] leading-relaxed text-zinc-400">
        {t("rental.payAtPickup")}
      </p>
    </div>
  );
}
