import RentalApp from "@/components/RentalApp";
import { getRentalLocations } from "@/lib/locations.server";
import { getProducts } from "@/lib/products.server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [locations, products] = await Promise.all([
    getRentalLocations(),
    getProducts(),
  ]);

  return <RentalApp locations={locations} products={products} />;
}
