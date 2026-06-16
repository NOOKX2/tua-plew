import type { Product, ProductRatingSummary, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory } from "@/lib/locations";
import { getTranslator } from "@/lib/i18n/server";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  locations: RentalLocation[];
  ratingSummaries: Record<string, ProductRatingSummary>;
};

export default async function PartnerShoeCatalog({
  products,
  locations,
  ratingSummaries,
}: Props) {
  const t = await getTranslator();
  const partnerShoes = products.filter((p) => p.isPartnerBrand);

  if (!partnerShoes.length) return null;

  return (
    <section
      id="partner-shoes"
      className="scroll-mt-24 border-t border-zinc-200/80 bg-emerald-50/40 py-10 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              {t("home.partnerShoesEyebrow")}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {t("home.partnerShoesTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              {t("home.partnerShoesSubtitle")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {partnerShoes.map((shoe) => (
              <span
                key={shoe.id}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200"
              >
                {shoe.brand}
              </span>
            ))}
          </div>
        </div>

        <p className="mb-3 flex items-center gap-1.5 text-xs text-zinc-500 sm:hidden">
          <span className="inline-block animate-pulse">→</span>
          {t("home.scrollForMore")}
        </p>

        <div className="relative">
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-emerald-50/90 via-emerald-50/70 to-transparent sm:hidden" />

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 lg:gap-5">
            {partnerShoes.map((product, index) => (
              <div
                key={product.id}
                className={`min-w-[82%] shrink-0 snap-start sm:min-w-0 ${
                  index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <ProductCard
                  product={product}
                  variant="catalog"
                  layout={index === 0 ? "featured" : "catalog"}
                  globalInventory={getAggregatedProductInventory(
                    product.id,
                    locations,
                    products,
                  )}
                  ratingSummary={ratingSummaries[product.id]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
