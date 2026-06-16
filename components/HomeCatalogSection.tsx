"use client";

import { useMemo } from "react";
import type { Product, SizeInventory } from "@/lib/types";
import {
  APPAREL_TIER_ORDER,
  getProductTier,
  type ApparelTier,
} from "@/lib/apparel-tiers";
import { useTranslations } from "@/lib/i18n/client";
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

const TIER_ACCENT: Record<ApparelTier, string> = {
  essential: "bg-blue-500",
  studio: "bg-violet-500",
  tactical: "bg-zinc-800",
};

export default function HomeCatalogSection({
  items,
  embedded = false,
  secondary = false,
}: Props) {
  const t = useTranslations();

  const groups = useMemo(
    () =>
      APPAREL_TIER_ORDER.map((tier) => ({
        tier,
        items: items.filter((item) => getProductTier(item.product) === tier),
      })).filter((group) => group.items.length > 0),
    [items],
  );

  return (
    <section
      id="catalog"
      className={`mx-auto w-full max-w-7xl scroll-mt-24 px-4 sm:px-6 ${
        embedded ? "pt-3 pb-8 sm:pt-4 sm:pb-10" : "py-10 sm:py-14"
      }`}
    >
      <div className={embedded ? "mb-4" : "mb-8"}>
        {(!embedded || secondary) && (
          <p
            className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${
              secondary ? "text-zinc-500" : "text-blue-600"
            }`}
          >
            {t("home.catalogEyebrow")}
          </p>
        )}
        <h2
          className={`font-bold tracking-tight text-zinc-900 ${
            embedded && secondary
              ? "text-lg sm:text-xl"
              : "text-2xl sm:text-3xl"
          }`}
        >
          {t("home.catalogTitle")}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">
          {t("home.catalogSubtitle")}
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          {t("home.noProductsInCategory")}
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.tier}>
              <div className="mb-4 flex items-baseline gap-3">
                <span
                  className={`mt-1 h-4 w-1 shrink-0 rounded-full ${TIER_ACCENT[group.tier]}`}
                  aria-hidden
                />
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-zinc-900">
                    {t(`apparelTiers.tiers.${group.tier}.name`)}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {t(`apparelTiers.tiers.${group.tier}.segment`)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                {group.items.map((item) => (
                  <ProductCard
                    key={item.product.id}
                    product={item.product}
                    variant="catalog"
                    layout="catalog"
                    globalInventory={item.globalInventory}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
