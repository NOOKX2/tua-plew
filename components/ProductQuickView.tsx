"use client";

import Image from "next/image";
import Link from "next/link";
import type { LocationProductStock, Product, RentalLocation } from "@/lib/types";
import { getStockTotal } from "@/lib/locations";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getCategoryLabel } from "@/lib/i18n/labels";
import RentalBookingPanel from "./RentalBookingPanel";
import SizeInventory from "./SizeInventory";
import StockBadge from "./StockBadge";

type Props = {
  product: Product;
  stock: LocationProductStock;
  location: RentalLocation;
  onClose: () => void;
  embedded?: boolean;
};

export default function ProductQuickView({
  product,
  stock,
  location,
  onClose,
  embedded = false,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const total = getStockTotal(stock.inventory);

  return (
    <div
      className={
        embedded
          ? "border-t border-emerald-200/80 bg-white/80 px-4 py-3"
          : "rounded-xl border border-emerald-200 bg-white shadow-sm"
      }
    >
      {!embedded && (
        <div className="flex items-center justify-end border-b border-zinc-100 px-4 py-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-0.5 text-xs text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            aria-label={t("common.close")}
          >
            ✕ {t("common.close")}
          </button>
        </div>
      )}

      <div className={embedded ? "" : "p-4"}>
        <div className="flex gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-1.5"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-medium text-zinc-400">
              {getCategoryLabel(product.category, locale, messages)}
            </span>
            <h3 className="text-sm font-bold text-zinc-900">
              <Link
                href={`/products/${product.id}?from=map`}
                className="hover:text-emerald-600 hover:underline"
              >
                {product.name}
              </Link>
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-emerald-600">
                ฿{product.pricePerRental}
                <span className="font-normal text-zinc-500">
                  {" "}
                  {t("common.perRental")}
                </span>
              </p>
              <StockBadge total={total} unit={product.sizeUnit} size="sm" />
            </div>
          </div>
          {embedded && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg px-2 py-0.5 text-xs text-zinc-400 hover:bg-zinc-100"
              aria-label={t("common.close")}
            >
              ✕
            </button>
          )}
        </div>

        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          {product.description}
        </p>

        <div className="mt-3 rounded-lg bg-zinc-50 p-3">
          <p className="mb-2 text-xs font-medium text-zinc-600">
            {t("stock.stockAtLocation")}
          </p>
          <SizeInventory
            inventory={stock.inventory}
            sizes={product.sizes}
            unit={product.sizeUnit}
            compact
          />
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <Link
            href={`/products/${product.id}?from=map`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            {t("common.fullDetails")}
          </Link>
        </div>

        <RentalBookingPanel
          product={product}
          availability={[{ location, stock }]}
          fixedLocationId={location.id}
          compact
          callbackUrl={`/map?product=${product.id}`}
        />
      </div>
    </div>
  );
}
