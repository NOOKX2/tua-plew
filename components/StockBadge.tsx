"use client";

import type { SizeUnit } from "@/lib/types";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getSizeUnitLabel } from "@/lib/i18n/labels";

type Props = {
  total: number;
  unit?: SizeUnit;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

export default function StockBadge({ total, unit = "ตัว", size = "md" }: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const unitLabel = getSizeUnitLabel(unit, locale, messages);

  const styles =
    total === 0
      ? "bg-red-500 text-white"
      : total <= 5
        ? "bg-amber-500 text-white"
        : "bg-emerald-600 text-white";

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold shadow-sm ${sizeStyles[size]} ${styles}`}
    >
      {total === 0
        ? t("stock.out")
        : t("stock.remaining", { count: total, unit: unitLabel })}
    </span>
  );
}
