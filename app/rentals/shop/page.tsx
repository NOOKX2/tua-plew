import type { Metadata } from "next";
import RentalViewTabs from "@/components/RentalViewTabs";
import HomeRentalSection from "@/components/HomeRentalSection";
import { getAggregatedProductInventory } from "@/lib/locations";
import { getRentalLocations } from "@/lib/locations.server";
import { getProducts } from "@/lib/products.server";
import { getProductRatingSummaries } from "@/lib/reviews";
import { getTranslator } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.mapTitle"),
    description: t("meta.mapDescription"),
  };
}

export default async function RentalShopPage() {
  const [locations, products] = await Promise.all([
    getRentalLocations(),
    getProducts(),
  ]);

  const partnerShoeIds = products
    .filter((p) => p.isPartnerBrand)
    .map((p) => p.id);
  const ratingSummaries = await getProductRatingSummaries(partnerShoeIds);

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
    <main className="flex min-h-0 flex-1 flex-col bg-[#faf9f6]">
      <RentalViewTabs />
      <HomeRentalSection
        locations={locations}
        products={products}
        catalogItems={catalogItems}
        ratingSummaries={ratingSummaries}
      />
    </main>
  );
}
