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
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
          {t("home.partnerShoesTitle")}
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm">
          {t("home.partnerShoesSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {partnerShoes.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="catalog"
            globalInventory={getAggregatedProductInventory(
              product.id,
              locations,
              products,
            )}
            ratingSummary={ratingSummaries[product.id]}
          />
        ))}
      </div>
    </section>
  );
}
