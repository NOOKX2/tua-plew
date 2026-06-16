"use client";

import { useMemo, useState } from "react";
import type { Product, ProductCategory, SizeInventory } from "@/lib/types";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getCategoryLabel } from "@/lib/i18n/labels";
import ProductCard from "./ProductCard";

export type CatalogItem = {
  product: Product;
  globalInventory: SizeInventory;
};

type Props = {
  items: CatalogItem[];
  embedded?: boolean;
  secondary?: boolean;
};

const CATEGORIES: Array<ProductCategory | "all"> = [
  "all",
  "top",
  "bottom",
  "set",
  "shoe",
];

export default function HomeCatalogSection({
  items,
  embedded = false,
  secondary = false,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(
    "all",
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.product.category === activeCategory);
  }, [activeCategory, items]);

  return (
    <section
      id="catalog"
      className={`mx-auto w-full max-w-7xl scroll-mt-24 px-4 sm:px-6 ${
        embedded ? "pt-3 pb-8 sm:pt-4 sm:pb-10" : "py-10 sm:py-14"
      }`}
    >
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${
          embedded ? "mb-4" : "mb-8"
        }`}
      >
        <div>
          {(!embedded || secondary) && (
            <p
              className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                secondary ? "text-zinc-500" : "text-emerald-600"
              }`}
            >
              {t("home.catalogEyebrow")}
            </p>
          )}
          <h2
            className={`font-bold tracking-tight text-zinc-900 ${
              embedded && secondary
                ? "text-lg sm:text-xl"
                : embedded
                  ? "text-2xl sm:text-3xl"
                  : "text-2xl sm:text-3xl"
            }`}
          >
            {t("home.catalogTitle")}
          </h2>
          {(secondary || !embedded) && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">
              {t("home.catalogSubtitle")}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const active = activeCategory === category;
            const label =
              category === "all"
                ? t("common.all")
                : getCategoryLabel(category, locale, messages);

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:ring-zinc-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          {t("home.noProductsInCategory")}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.product.id}
              product={item.product}
              variant="catalog"
              layout="catalog"
              globalInventory={item.globalInventory}
            />
          ))}
        </div>
      )}
    </section>
  );
}
