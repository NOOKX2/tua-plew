"use client";

import Image from "next/image";
import type { RentalLocation } from "@/lib/types";
import { getProductById } from "@/lib/products";
import { getStockTotal, getTotalStock } from "@/lib/locations";

const typeLabels = {
  booth: "ตู้เช่าอัตโนมัติ",
  qr: "สแกน QR",
  partner: "พาร์ทเนอร์",
};

type Props = {
  location: RentalLocation;
  selected: boolean;
  onSelect: (id: string) => void;
  highlightProductId?: string | null;
};

export default function LocationCard({
  location,
  selected,
  onSelect,
  highlightProductId,
}: Props) {
  const total = getTotalStock(location);

  return (
    <button
      type="button"
      onClick={() => onSelect(location.id)}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        selected
          ? "border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-500/20"
          : "border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-sm"
      }`}
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

      <div className="mb-3 flex items-center gap-3 text-xs text-zinc-500">
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

      {/* Product thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {location.products.map((stock) => {
          const product = getProductById(stock.productId);
          if (!product) return null;
          const qty = getStockTotal(stock.inventory);
          const highlighted = highlightProductId === stock.productId;
          return (
            <div
              key={stock.productId}
              className={`relative shrink-0 rounded-lg border p-1.5 ${
                highlighted
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-zinc-100 bg-zinc-50"
              }`}
              title={`${product.name} — เหลือ ${qty} ${product.sizeUnit}`}
            >
              <div className="relative h-12 w-12">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
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
            </div>
          );
        })}
      </div>
    </button>
  );
}
