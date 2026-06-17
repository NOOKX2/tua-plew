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
};

const TIER_STYLE: Record<
  ApparelTier,
  { accent: string; emoji: string }
> = {
  essential: { accent: "from-blue-500 to-blue-600", emoji: "🏃" },
  studio: { accent: "from-violet-500 to-fuchsia-500", emoji: "🧘" },
  tactical: { accent: "from-zinc-700 to-zinc-900", emoji: "🔥" },
};

export default function ApparelTierCatalog({ items }: Props) {
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
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-8 pt-2 sm:px-6 sm:pb-10"
    >
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          {t("apparelTiers.eyebrow")}
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {t("apparelTiers.title")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
          {t("home.catalogSubtitle")}
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          {t("home.noProductsInCategory")}
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => {
            const style = TIER_STYLE[group.tier];
            return (
              <article
                key={group.tier}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                <div
                  className={`flex items-center gap-3 bg-linear-to-br ${style.accent} px-5 py-4 text-white`}
                >
                  <span className="text-2xl" aria-hidden>
                    {style.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold leading-tight sm:text-lg">
                      {t(`apparelTiers.tiers.${group.tier}.name`)}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-medium text-white/80 sm:text-xs">
                      {t(`apparelTiers.tiers.${group.tier}.segment`)}
                    </p>
                  </div>
                  <p className="hidden shrink-0 text-right text-sm font-bold text-white/95 sm:block">
                    {t(`apparelTiers.tiers.${group.tier}.price`)}
                  </p>
                </div>

                <div className="p-4 sm:p-5">
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {t(`apparelTiers.tiers.${group.tier}.description`)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">
                      {t(`apparelTiers.tiers.${group.tier}.forWho`)}
                    </span>
                    <span className="font-semibold text-blue-600 sm:hidden">
                      {t(`apparelTiers.tiers.${group.tier}.price`)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
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
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-5 text-center text-xs text-zinc-400">
        {t("apparelTiers.perRentalNote")}
      </p>
    </section>
  );
}
