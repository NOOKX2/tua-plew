import RentalApp from "@/components/RentalApp";
import { rentalLocations } from "@/lib/locations";
import { products } from "@/lib/products";

export default function Home() {
  return <RentalApp locations={rentalLocations} products={products} />;
}
