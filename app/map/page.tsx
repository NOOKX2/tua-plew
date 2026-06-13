import type { Metadata } from "next";
import RentalMapView from "@/components/RentalMapView";
import { getRentalLocations } from "@/lib/locations";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "แผนที่จุดเช่า | Fit-to-Go",
  description: "ค้นหาจุดเช่าชุดกีฬา Fit-to-Go ใกล้คุณบนแผนที่",
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
