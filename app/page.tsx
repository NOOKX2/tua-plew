import RentalApp from "@/components/RentalApp";
import { getRentalLocations } from "@/lib/locations";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const [locations, products] = await Promise.all([
    getRentalLocations(),
    getProducts(),
  ]);

  return <RentalApp locations={locations} products={products} />;
}
