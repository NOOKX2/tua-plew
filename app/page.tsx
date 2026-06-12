import RentalApp from "@/components/RentalApp";
import { rentalLocations } from "@/lib/locations";
import { products } from "@/lib/products";

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { product } = await searchParams;

  return (
    <RentalApp
      initialProductId={product ?? null}
      locations={rentalLocations}
      products={products}
    />
  );
}
