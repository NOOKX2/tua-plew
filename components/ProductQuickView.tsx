"use client";

import Image from "next/image";
import Link from "next/link";
import type { LocationProductStock, Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { getStockTotal } from "@/lib/locations";
import SizeInventory from "./SizeInventory";
import StockBadge from "./StockBadge";

type Props = {
  product: Product;
  stock: LocationProductStock;
  onClose: () => void;
  embedded?: boolean;
};

export default function ProductQuickView({
  product,
  stock,
  onClose,
  embedded = false,
}: Props) {
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
            aria-label="ปิด"
          >
            ✕ ปิด
          </button>
        </div>
      )}

      <div className={embedded ? "" : "p-4"}>
        <div className="flex gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-medium text-zinc-400">
              {CATEGORY_LABELS[product.category]}
            </span>
            <h3 className="text-sm font-bold text-zinc-900">{product.name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-emerald-600">
                ฿{product.pricePerRental}
                <span className="font-normal text-zinc-500"> /ครั้ง</span>
              </p>
              <StockBadge total={total} unit={product.sizeUnit} size="sm" />
            </div>
          </div>
          {embedded && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg px-2 py-0.5 text-xs text-zinc-400 hover:bg-zinc-100"
              aria-label="ปิด"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-3 rounded-lg bg-zinc-50 p-3">
          <p className="mb-2 text-xs font-medium text-zinc-600">
            สต็อกที่จุดนี้ (แต่ละไซส์)
          </p>
          <SizeInventory
            inventory={stock.inventory}
            sizes={product.sizes}
            unit={product.sizeUnit}
            compact
          />
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            เช่าที่จุดนี้
          </button>
          <Link
            href={`/products/${product.id}?from=map`}
            className="flex w-full items-center justify-center rounded-xl border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-emerald-200 hover:text-emerald-700"
          >
            รายละเอียดเต็ม →
          </Link>
        </div>
      </div>
    </div>
  );
}
