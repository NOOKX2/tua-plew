import type { Product, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory, getStockTotal } from "@/lib/locations";
import { getProductRatingSummaries } from "@/lib/reviews";
import { getTranslator } from "@/lib/i18n/server";
import HomeCatalogSection from "./HomeCatalogSection";
import HomeHero from "./HomeHero";
import PartnerShoeCatalog from "./PartnerShoeCatalog";

type Props = {
  locations: RentalLocation[];
  products: Product[];
};

export default async function RentalApp({ locations, products }: Props) {
  const t = await getTranslator();
  const partnerShoeIds = products
    .filter((p) => p.isPartnerBrand)
    .map((p) => p.id);
  const ratingSummaries = await getProductRatingSummaries(partnerShoeIds);
  const totalStock = products.reduce(
    (sum, p) =>
      sum + getStockTotal(getAggregatedProductInventory(p.id, locations, products)),
    0,
  );

  const catalogItems = products
    .filter((p) => !p.isPartnerBrand)
    .map((product) => ({
      product,
      globalInventory: getAggregatedProductInventory(
        product.id,
        locations,
        products,
      ),
    }));

  return (
    <div className="flex flex-1 flex-col bg-[#faf9f6]">
      <HomeHero
        productCount={products.length}
        locationCount={locations.length}
        readyCount={totalStock}
      />

      <HomeCatalogSection items={catalogItems} embedded />

      <PartnerShoeCatalog
        products={products}
        locations={locations}
        ratingSummaries={ratingSummaries}
      />

      <footer className="border-t border-zinc-200/80 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-medium text-zinc-700">{t("home.footer")}</p>
          <p className="text-xs text-zinc-400">{t("home.footerTagline")}</p>
        </div>
      </footer>
    </div>
  );
}
