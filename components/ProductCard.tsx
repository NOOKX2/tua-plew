"use client";

import Image from "next/image";
import Link from "next/link";
import type {
  LocationProductStock,
  Product,
  SizeInventory as SizeInventoryType,
} from "@/lib/types";
import { getStockTotal } from "@/lib/locations";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getCategoryLabel } from "@/lib/i18n/labels";
import SizeInventory from "./SizeInventory";
import StockBadge from "./StockBadge";

type Props = {
  product: Product;
  stock?: LocationProductStock;
  globalInventory?: SizeInventoryType;
  variant?: "catalog" | "location";
  selected?: boolean;
  categoryLabel?: string;
  colorLabel?: string;
  perRentalLabel?: string;
};

export default function ProductCard({
  product,
  stock,
  globalInventory,
  variant = "catalog",
  selected,
  categoryLabel: categoryLabelProp,
  colorLabel: colorLabelProp,
  perRentalLabel: perRentalLabelProp,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const categoryLabel =
    categoryLabelProp ?? getCategoryLabel(product.category, locale, messages);
  const colorLabel = colorLabelProp ?? t("common.color");
  const perRentalLabel = perRentalLabelProp ?? t("common.perRental");

  const locationTotal = stock ? getStockTotal(stock.inventory) : null;
  const globalTotal = globalInventory
    ? getStockTotal(globalInventory)
    : null;
  const displayInventory = stock?.inventory ?? globalInventory;
  const displayTotal = locationTotal ?? globalTotal;
  const isCatalog = variant === "catalog";

  const content = (
    <div className={isCatalog ? "flex flex-col" : "flex gap-4 p-4"}>
      <div
        className={
          isCatalog
            ? "relative aspect-square w-full overflow-hidden bg-neutral-50"
            : "relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-50 sm:h-32 sm:w-32"
        }
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={
            isCatalog
              ? "object-contain p-3"
              : "object-contain p-2"
          }
          sizes={isCatalog ? "(max-width: 640px) 50vw, 20vw" : "128px"}
        />
        <span className="absolute left-1.5 top-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-600 shadow-sm">
          {categoryLabel}
        </span>
      </div>

      <div
        className={
          isCatalog
            ? "flex flex-1 flex-col p-2.5 pt-2 sm:p-3"
            : "flex min-w-0 flex-1 flex-col"
        }
      >
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3
            className={
              isCatalog
                ? "line-clamp-2 text-sm font-semibold leading-snug text-zinc-900"
                : "font-semibold text-zinc-900"
            }
          >
            {isCatalog ? (
              product.name
            ) : (
              <Link
                href={`/products/${product.id}`}
                className="hover:text-emerald-600 hover:underline"
              >
                {product.name}
              </Link>
            )}
          </h3>
          {displayTotal !== null && !isCatalog && (
            <StockBadge
              total={displayTotal}
              unit={product.sizeUnit}
              size="sm"
            />
          )}
        </div>

        {!isCatalog && (
          <p className="mb-2 line-clamp-2 text-xs text-zinc-500">
            {product.description}
          </p>
        )}

        {isCatalog ? (
          <p className="mb-2 text-[11px] text-zinc-500">
            {colorLabel} {product.color}
          </p>
        ) : (
          <div className="mb-3 flex flex-wrap gap-2 text-[11px] text-zinc-500">
            <span className="rounded-md bg-zinc-100 px-2 py-0.5">
              {colorLabel} {product.color}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5">
              {product.material}
            </span>
          </div>
        )}

        {displayInventory && (
          <div className={isCatalog ? "mb-2" : "mb-3 border-t border-zinc-100 pt-3"}>
            {!isCatalog && (
              <p className="mb-2 text-xs font-medium text-zinc-600">
                {t("stock.remainingBySize")}
              </p>
            )}
            <SizeInventory
              inventory={displayInventory}
              sizes={product.sizes}
              unit={product.sizeUnit}
              compact={isCatalog}
            />
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <p className="text-sm font-bold text-emerald-600">
            ฿{product.pricePerRental}
            <span className="text-[11px] font-normal text-zinc-500">
              {" "}
              {perRentalLabel}
            </span>
          </p>
          {isCatalog && displayTotal !== null && (
            <StockBadge
              total={displayTotal}
              unit={product.sizeUnit}
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  );

  if (isCatalog) {
    return (
      <Link
        href={`/products/${product.id}`}
        className={`block rounded-xl border bg-white transition-all hover:border-emerald-300 hover:shadow-sm ${
          selected
            ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
            : "border-zinc-200"
        }`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {content}
    </div>
  );
}
