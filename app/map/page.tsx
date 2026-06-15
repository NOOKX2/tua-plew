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
    <RentalMapView
      initialProductId={product ?? null}
      initialLocationId={location ?? null}
      locations={locations}
      products={products}
    />
  );
}
