import type { Metadata } from "next";
import RentalMapView from "@/components/RentalMapView";
import { rentalLocations } from "@/lib/locations";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "แผนที่จุดเช่า | Fit-to-Go",
  description: "ค้นหาจุดเช่าชุดกีฬา Fit-to-Go ใกล้คุณบนแผนที่",
};

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function MapPage({ searchParams }: Props) {
  const { product } = await searchParams;

  return (
    <RentalMapView
      initialProductId={product ?? null}
      locations={rentalLocations}
      products={products}
    />
  );
}
