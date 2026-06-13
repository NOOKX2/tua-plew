"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product, RentalLocation } from "@/lib/types";
import { getProductById } from "@/lib/products";
import { getStockTotal, getTotalStock } from "@/lib/locations";
import ProductQuickView from "./ProductQuickView";

const typeLabels = {
  booth: "ตู้เช่าอัตโนมัติ",
  qr: "สแกน QR",
  partner: "พาร์ทเนอร์",
};

type Props = {
  location: RentalLocation;
  products: Product[];
  selected: boolean;
  onSelect: (id: string) => void;
  highlightProductId?: string | null;
  expandedProductId?: string | null;
  onProductClick?: (productId: string) => void;
  onCloseProduct?: () => void;
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
}: Props) {
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
            {typeLabels[location.type]}
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
            รวม {total} ชิ้น · {location.products.length} สินค้า
          </span>
        </div>
      </button>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        {location.products.map((stock) => {
          const product = getProductById(stock.productId, products);
          if (!product) return null;
          const qty = getStockTotal(stock.inventory);
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

          const thumbContent = (
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
                className={`mt-0.5 block text-center text-[10px] font-bold ${
                  qty === 0 ? "text-red-400" : "text-zinc-600"
                }`}
              >
                {qty === 0 ? "หมด" : qty}
              </span>
            </>
          );

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
                title={`${product.name} — เหลือ ${qty} ${product.sizeUnit}`}
              >
                {thumbContent}
              </button>
            );
          }

          return (
            <Link
              key={stock.productId}
              href={`/products/${product.id}`}
              className={thumbClass}
              title={`${product.name} — เหลือ ${qty} ${product.sizeUnit}`}
            >
              {thumbContent}
            </Link>
          );
        })}
      </div>

      {expandedProduct && expandedStock && onCloseProduct && (
        <ProductQuickView
          embedded
          product={expandedProduct}
          stock={expandedStock}
          onClose={onCloseProduct}
        />
      )}
    </div>
  );
}
