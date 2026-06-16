"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product, RentalLocation } from "@/lib/types";
import { getProductById } from "@/lib/products";
import { getStockTotal, getTotalStock } from "@/lib/locations";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getLocationTypeLabel, getSizeUnitLabel } from "@/lib/i18n/labels";
import ProductQuickView from "./ProductQuickView";

type Props = {
  location: RentalLocation;
  products: Product[];
  selected: boolean;
  onSelect: (id: string) => void;
  highlightProductId?: string | null;
  expandedProductId?: string | null;
  onProductClick?: (productId: string) => void;
  onCloseProduct?: () => void;
  hideEmbeddedQuickView?: boolean;
};

export default function LocationCard({
  location,
  products,
  selected,
  onSelect,
  highlightProductId,
  expandedProductId,
  onProductClick,
  onCloseProduct,
  hideEmbeddedQuickView = false,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const total = getTotalStock(location);
  const expandedStock = location.products.find(
    (p) => p.productId === expandedProductId,
  );
  const expandedProduct = expandedProductId
    ? getProductById(expandedProductId, products)
    : null;

  return (
    <div
      id={`location-card-${location.id}`}
      className={`w-full scroll-mt-3 rounded-xl border transition-all ${
        selected
          ? "border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-500/20"
          : "border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(location.id)}
        className="w-full p-4 pb-3 text-left"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-zinc-900">{location.name}</h3>
            {location.partnerName && (
              <p className="text-xs text-emerald-600">{location.partnerName}</p>
            )}
            <p className="mt-0.5 text-xs text-zinc-500">{location.address}</p>
          </div>
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
            {getLocationTypeLabel(location.type, locale, messages)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>🕐 {location.openHours}</span>
          <span
            className={
              total === 0
                ? "font-medium text-red-500"
                : total <= 5
                  ? "font-medium text-amber-600"
                  : "font-medium text-emerald-600"
            }
          >
            {t("common.totalItems", {
              total,
              products: location.products.length,
            })}
          </span>
        </div>
      </button>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        {location.products.map((stock) => {
          const product = getProductById(stock.productId, products);
          if (!product) return null;
          const qty = getStockTotal(stock.inventory);
          const unitLabel = getSizeUnitLabel(product.sizeUnit, locale, messages);
          const isActive =
            expandedProductId === stock.productId ||
            highlightProductId === stock.productId;
          const thumbClass = `relative shrink-0 rounded-lg border p-1.5 transition-colors ${
            onProductClick
              ? "cursor-pointer hover:border-emerald-300 hover:shadow-sm"
              : ""
          } ${
            isActive
              ? "border-emerald-500 bg-emerald-100 ring-2 ring-emerald-500/30"
              : "border-zinc-100 bg-zinc-50"
          }`;

          const thumbInner = (
            <>
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-neutral-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </div>
              <span
                className={`mt-0.5 block max-w-[52px] truncate text-center text-[9px] font-medium text-zinc-700`}
                title={product.name}
              >
                {product.name}
              </span>
              <span
                className={`block text-center text-[10px] font-bold ${
                  qty === 0 ? "text-red-400" : "text-zinc-600"
                }`}
              >
                {qty === 0 ? t("stock.out") : qty}
              </span>
            </>
          );

          const title =
            qty === 0
              ? `${product.name} — ${t("stock.out")}`
              : `${product.name} — ${t("stock.remaining", { count: qty, unit: unitLabel })}`;

          if (onProductClick) {
            return (
              <button
                key={stock.productId}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onProductClick(stock.productId);
                }}
                className={thumbClass}
                title={title}
              >
                {thumbInner}
              </button>
            );
          }

          return (
            <Link
              key={stock.productId}
              href={`/products/${product.id}?from=map`}
              className={thumbClass}
              title={title}
            >
              {thumbInner}
            </Link>
          );
        })}
      </div>

      {expandedProduct && expandedStock && onCloseProduct && (
        <div className={hideEmbeddedQuickView ? "hidden lg:block" : undefined}>
          <ProductQuickView
            embedded
            product={expandedProduct}
            stock={expandedStock}
            location={location}
            onClose={onCloseProduct}
          />
        </div>
      )}
    </div>
  );
}
