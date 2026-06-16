"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import type { ProductAvailability } from "@/lib/locations";
import { getStockTotal } from "@/lib/locations";
import { useTranslations } from "@/lib/i18n/client";
import SizeInventory from "./SizeInventory";
import StockBadge from "./StockBadge";

type Props = {
  items: ProductAvailability[];
  product: Product;
};

export default function ProductAvailabilityList({ items, product }: Props) {
  const t = useTranslations();

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
        {t("stock.noAvailability")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map(({ location, stock }) => {
        const total = getStockTotal(stock.inventory);
        return (
          <div
            key={location.id}
            className="rounded-xl border border-zinc-200 bg-white p-4"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-zinc-900">{location.name}</h3>
                {location.partnerName && (
                  <p className="text-xs text-blue-600">{location.partnerName}</p>
                )}
                <p className="mt-0.5 text-xs text-zinc-500">{location.address}</p>
              </div>
              <StockBadge
                total={total}
                unit={product?.sizeUnit ?? "ตัว"}
                size="sm"
              />
            </div>
            <p className="mb-2 text-xs text-zinc-500">🕐 {location.openHours}</p>
            {product && (
              <SizeInventory
                inventory={stock.inventory}
                sizes={product.sizes}
                unit={product.sizeUnit}
                compact
              />
            )}
          </div>
        );
      })}

      <Link
        href={`/map?product=${product.id}`}
        className="mt-1 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        {t("common.viewOnMap")}
      </Link>
    </div>
  );
}
