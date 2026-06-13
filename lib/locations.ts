import { fetchLocationById, fetchLocations } from "./data";
import type {
  LocationProductStock,
  Product,
  RentalLocation,
  SizeInventory,
} from "./types";

export async function getRentalLocations(): Promise<RentalLocation[]> {
  return fetchLocations();
}

export async function getLocationByIdAsync(
  id: string,
): Promise<RentalLocation | undefined> {
  return fetchLocationById(id);
}

export function getStockTotal(inventory: SizeInventory): number {
  return Object.values(inventory).reduce((sum, qty) => sum + qty, 0);
}

export function getProductStock(
  products: LocationProductStock[],
  productId: string,
): SizeInventory | undefined {
  return products.find((product) => product.productId === productId)?.inventory;
}

export function getTotalStock(location: RentalLocation): number {
  return location.products.reduce(
    (sum, product) => sum + getStockTotal(product.inventory),
    0,
  );
}

export function getLocationById(
  id: string,
  locations: RentalLocation[],
): RentalLocation | undefined {
  return locations.find((location) => location.id === id);
}

export type ProductAvailability = {
  location: RentalLocation;
  stock: LocationProductStock;
};

export function getLocationsWithProduct(
  productId: string,
  locations: RentalLocation[],
): ProductAvailability[] {
  return locations
    .map((location) => {
      const stock = location.products.find(
        (product) => product.productId === productId,
      );
      if (!stock) return null;
      return { location, stock };
    })
    .filter((item): item is ProductAvailability => item !== null);
}

export function getTotalProductStock(
  productId: string,
  locations: RentalLocation[],
  products: Product[],
): number {
  return getStockTotal(
    getAggregatedProductInventory(productId, locations, products),
  );
}

export function getAggregatedProductInventory(
  productId: string,
  locations: RentalLocation[],
  products: Product[],
): SizeInventory {
  const product = products.find((item) => item.id === productId);
  if (!product) return {};

  const inventory = Object.fromEntries(
    product.sizes.map((size) => [size, 0]),
  ) as SizeInventory;

  for (const location of locations) {
    const stock = location.products.find(
      (item) => item.productId === productId,
    );
    if (!stock) continue;
    for (const size of product.sizes) {
      inventory[size] += stock.inventory[size] ?? 0;
    }
  }

  return inventory;
}

export function getLocationsWithProductFrom(
  productId: string,
  locations: RentalLocation[],
): ProductAvailability[] {
  return getLocationsWithProduct(productId, locations);
}
