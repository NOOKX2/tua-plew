import type { Metadata } from "next";
import RentalMapView from "@/components/RentalMapView";
import { getRentalLocations } from "@/lib/locations.server";
import { getProducts } from "@/lib/products.server";
import { getTranslator } from "@/lib/i18n/server";

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
    getRentalLocations(),
    getProducts(),
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <RentalMapView
        initialProductId={product ?? null}
        initialLocationId={location ?? null}
        locations={locations}
        products={products}
      />
    </div>
  );
}
