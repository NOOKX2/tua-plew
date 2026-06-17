import HomePage from "@/components/HomePage";
import { getCommunityEvents } from "@/lib/community.server";
import { getRentalLocations } from "@/lib/locations.server";
import { getProducts } from "@/lib/products.server";

export const revalidate = 60;

export default async function Home() {
  const [events, locations, products] = await Promise.all([
    getCommunityEvents(),
    getRentalLocations(),
    getProducts(),
  ]);

  return (
    <HomePage events={events} locations={locations} products={products} />
  );
}
