import type { Metadata } from "next";
import RentalMapView from "@/components/RentalMapView";
import RentalViewTabs from "@/components/RentalViewTabs";
import { getRentalLocationsFresh } from "@/lib/locations.server";
import { getProducts } from "@/lib/products.server";
import { getTranslator } from "@/lib/i18n/server";

const MAP_LOCATION_IDS = new Set(["central-park", "sirikit", "rotfai"]);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.mapTitle"),
    description: t("meta.mapDescription"),
  };
}

type Props = {
  searchParams: Promise<{ product?: string; location?: string }>;
};

export default async function MapPage({ searchParams }: Props) {
  const { product, location } = await searchParams;
  const [locations, products] = await Promise.all([
    getRentalLocationsFresh(),
    getProducts(),
  ]);

  const filteredLocations = locations.filter((loc) =>
    MAP_LOCATION_IDS.has(loc.id),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <RentalViewTabs />
      <RentalMapView
        initialProductId={product ?? null}
        initialLocationId={location ?? null}
        locations={filteredLocations}
        products={products}
      />
    </div>
  );
}
