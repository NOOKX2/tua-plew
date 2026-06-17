import HomePage from "@/components/HomePage";
import { CATALOG_PAGE_REVALIDATE } from "@/lib/catalog-revalidate";
import { getCommunityEvents } from "@/lib/community.server";
import { getRentalLocations } from "@/lib/locations.server";
import { getProducts } from "@/lib/products.server";

export const revalidate = CATALOG_PAGE_REVALIDATE;

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
