"use client";

import Image from "next/image";
import Link from "next/link";
import type {
  LocationProductStock,
  Product,
  ProductRatingSummary,
  SizeInventory as SizeInventoryType,
} from "@/lib/types";
import { getStockTotal } from "@/lib/locations";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getCategoryLabel } from "@/lib/i18n/labels";
import SizeInventory from "./SizeInventory";
import StockBadge from "./StockBadge";
import StarRating from "./StarRating";

type Props = {
  product: Product;
  stock?: LocationProductStock;
  globalInventory?: SizeInventoryType;
  variant?: "catalog" | "location";
  layout?: "default" | "catalog" | "featured";
  selected?: boolean;
  categoryLabel?: string;
  colorLabel?: string;
  perRentalLabel?: string;
  ratingSummary?: ProductRatingSummary;
};

export default function ProductCard({
  product,
  stock,
  globalInventory,
  variant = "catalog",
  layout = "default",
  selected,
  categoryLabel: categoryLabelProp,
  colorLabel: colorLabelProp,
  perRentalLabel: perRentalLabelProp,
  ratingSummary,
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
  const isCatalogCard = isCatalog && layout === "catalog";
  const isFeatured = isCatalog && layout === "featured";
  const showSizeGrid =
    isCatalog && Boolean(displayInventory) && layout !== "default";

  const tagLabel =
    product.isPartnerBrand && product.brand ? product.brand : categoryLabel;

  const content = (
    <div
      className={
        isCatalog
          ? `flex h-full flex-col ${isFeatured ? "p-4 sm:p-5" : ""}`
          : "flex gap-4 p-4"
      }
    >
      <div
        className={
          isFeatured
            ? "relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900"
            : isCatalogCard
              ? "relative aspect-square w-full overflow-hidden rounded-t-2xl bg-gradient-to-b from-zinc-100 to-zinc-50"
              : isCatalog
                ? "relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-zinc-100 to-zinc-50"
                : "relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-50 sm:h-32 sm:w-32"
        }
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={
            isFeatured
              ? "object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              : isCatalog
                ? "object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-4"
                : "object-contain p-2"
          }
          sizes={
            isFeatured
              ? "(max-width: 640px) 78vw, 25vw"
              : isCatalog
                ? "(max-width: 640px) 50vw, 20vw"
                : "128px"
          }
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${
            product.isPartnerBrand
              ? "bg-amber-400 text-zinc-900"
              : "bg-white/95 text-zinc-700"
          }`}
        >
          {tagLabel}
        </span>

        {isCatalog && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-xs font-medium text-white">
              {t("common.viewDetails")}
            </p>
          </div>
        )}
      </div>

      <div
        className={
          isCatalog
            ? `flex flex-1 flex-col ${isFeatured ? "" : "p-3 sm:p-4"}`
            : "flex min-w-0 flex-1 flex-col"
        }
      >
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3
            className={
              isFeatured
                ? "line-clamp-2 text-base font-bold leading-snug text-zinc-900 sm:text-lg"
                : isCatalog
                  ? "line-clamp-2 text-sm font-semibold leading-snug text-zinc-900"
                  : "font-semibold text-zinc-900"
            }
          >
            {isCatalog ? (
              product.name
            ) : (
              <Link
                href={`/products/${product.id}`}
                className="hover:text-blue-600 hover:underline"
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

        {isCatalog && (
          <p className="mb-2 line-clamp-1 text-[11px] text-zinc-500">
            {colorLabel} {product.color}
          </p>
        )}

        {!isCatalog && (
          <p className="mb-2 line-clamp-2 text-xs text-zinc-500">
            {product.description}
          </p>
        )}

        {isCatalog && ratingSummary && ratingSummary.count > 0 && (
          <div className="mb-2 flex items-center gap-1.5">
            <StarRating rating={ratingSummary.averageRating} size="sm" />
            <span className="text-[11px] font-medium text-zinc-500">
              {ratingSummary.averageRating} ({ratingSummary.count})
            </span>
          </div>
        )}

        {!isCatalog ? (
          <div className="mb-3 flex flex-wrap gap-2 text-[11px] text-zinc-500">
            <span className="rounded-md bg-zinc-100 px-2 py-0.5">
              {colorLabel} {product.color}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5">
              {product.material}
            </span>
          </div>
        ) : null}

        {showSizeGrid && displayInventory && (
          <div className={isCatalog ? "mb-3" : "mb-3 border-t border-zinc-100 pt-3"}>
            {isCatalog && (
              <p className="mb-1.5 text-[10px] font-medium text-zinc-500">
                {t("stock.remainingBySize")}
              </p>
            )}
            {!isCatalog && (
              <p className="mb-2 text-xs font-medium text-zinc-600">
                {t("stock.remainingBySize")}
              </p>
            )}
            <SizeInventory
              inventory={displayInventory}
              sizes={product.sizes}
              unit={product.sizeUnit}
              compact
            />
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-zinc-100/80 pt-3">
          <p
            className={`font-bold text-blue-600 ${
              isFeatured ? "text-lg" : "text-sm"
            }`}
          >
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
        className={`group block h-full transition-all duration-300 ${
          isFeatured
            ? "rounded-[1.75rem] border border-zinc-200/80 bg-white shadow-sm hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/10"
            : `rounded-2xl border bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 ${
                isCatalogCard ? "overflow-hidden" : ""
              } ${
                selected
                  ? "border-blue-500 shadow-md ring-2 ring-blue-500/20"
                  : "border-zinc-200/80"
              }`
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
