import type { CommunityEvent, Product, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory } from "@/lib/locations";
import { getProductRatingSummaries } from "@/lib/reviews";
import { getTranslator } from "@/lib/i18n/server";
import HomeCommunitySection from "./HomeCommunitySection";
import HomeGateway from "./HomeGateway";
import HomeHero from "./HomeHero";
import HomeRentalSection from "./HomeRentalSection";

type Props = {
  events: CommunityEvent[];
  enrolledEventIds: string[];
  locations: RentalLocation[];
  products: Product[];
};

export default async function HomePage({
  events,
  enrolledEventIds,
  locations,
  products,
}: Props) {
  const t = await getTranslator();
  const partnerShoeIds = products
    .filter((p) => p.isPartnerBrand)
    .map((p) => p.id);
  const ratingSummaries = await getProductRatingSummaries(partnerShoeIds);

  const activityTypes = new Set(events.map((e) => e.activityType));
  const participantCount = events.reduce(
    (sum, event) => sum + event.participantCount,
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

  const rentalProductCount = catalogItems.length;
  const readyCount = catalogItems.reduce(
    (sum, item) =>
      sum +
      Object.values(item.globalInventory).reduce((a, b) => a + b, 0),
    0,
  );

  return (
    <div className="flex flex-1 flex-col bg-[#faf9f6]">
      <HomeHero
        eventCount={events.length}
        participantCount={participantCount}
        activityTypeCount={activityTypes.size}
        locationCount={locations.length}
        productCount={rentalProductCount}
        readyCount={readyCount}
      />

      <HomeGateway
        eventCount={events.length}
        participantCount={participantCount}
        locationCount={locations.length}
        productCount={rentalProductCount}
        readyCount={readyCount}
      />

      <HomeCommunitySection
        events={events}
        enrolledEventIds={enrolledEventIds}
      />

      <HomeRentalSection
        locations={locations}
        products={products}
        catalogItems={catalogItems}
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
