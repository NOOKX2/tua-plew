import type { Metadata } from "next";
import RentalMapView from "@/components/RentalMapView";
import { getRentalLocations } from "@/lib/locations.server";
import { getProducts } from "@/lib/products.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แผนที่จุดเช่า | Tua Plew",
  description: "ค้นหาจุดเช่าชุดกีฬา Tua Plew ใกล้คุณบนแผนที่",
};

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
