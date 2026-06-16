"use client";

import type { SizeInventory as SizeInventoryType, SizeUnit } from "@/lib/types";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getSizeUnitLabel } from "@/lib/i18n/labels";

type Props = {
  inventory: SizeInventoryType;
  sizes: string[];
  unit?: SizeUnit;
  compact?: boolean;
};

function stockLevel(qty: number): "empty" | "low" | "ok" {
  if (qty === 0) return "empty";
  if (qty <= 2) return "low";
  return "ok";
}

const levelStyles = {
  empty: "bg-zinc-100 text-zinc-400 border-zinc-200",
  low: "bg-amber-50 text-amber-700 border-amber-200",
  ok: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function SizeInventory({
  inventory,
  sizes,
  unit = "ตัว",
  compact,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const unitLabel = getSizeUnitLabel(unit, locale, messages);

  const gridClass =
    sizes.length > 5
      ? "grid grid-cols-3 gap-1 sm:grid-cols-6"
      : compact
        ? "grid grid-cols-5 gap-1"
        : "grid grid-cols-5 gap-2 sm:grid-cols-5";

  return (
    <div className={gridClass}>
      {sizes.map((size) => {
        const qty = inventory[size] ?? 0;
        const level = stockLevel(qty);
        return (
          <div
            key={size}
            className={`flex flex-col items-center rounded-md border px-0.5 ${compact ? "py-1" : "py-2"} ${levelStyles[level]}`}
          >
            <span className={compact ? "text-[9px] font-semibold" : "text-xs font-semibold"}>
              {size}
            </span>
            <span className={`font-bold ${compact ? "text-xs" : "text-lg"}`}>
              {qty}
            </span>
            {!compact && (
              <span className="text-[10px] opacity-70">
                {qty === 0 ? t("stock.out") : unitLabel}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
