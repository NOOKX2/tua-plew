import type { LocationProductStock, RentalLocation, SizeInventory } from "./types";
import { getProductById } from "./products";

export const rentalLocations: RentalLocation[] = [
  {
    id: "lumpini",
    name: "สวนลุมพินี",
    address: "ถ. พระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ",
    lat: 13.7307,
    lng: 100.5418,
    type: "booth",
    openHours: "06:00 – 20:00",
    products: [
      { productId: "dri-fit-tee", inventory: { XS: 2, S: 3, M: 4, L: 3, XL: 1 } },
      { productId: "running-shorts", inventory: { XS: 1, S: 2, M: 3, L: 2, XL: 1 } },
      { productId: "leggings", inventory: { XS: 0, S: 2, M: 3, L: 2, XL: 1 } },
      { productId: "yoga-set", inventory: { XS: 1, S: 1, M: 2, L: 1, XL: 0 } },
      { productId: "running-shoes", inventory: { "38": 1, "39": 2, "40": 3, "41": 2, "42": 1, "43": 0 } },
      { productId: "training-shoes", inventory: { "38": 0, "39": 1, "40": 2, "41": 2, "42": 1, "43": 1 } },
    ],
  },
  {
    id: "siam",
    name: "สยามสแควร์",
    address: "ถ. พระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ",
    lat: 13.7466,
    lng: 100.5347,
    type: "qr",
    openHours: "24 ชม.",
    products: [
      { productId: "dri-fit-tee", inventory: { XS: 1, S: 2, M: 2, L: 1, XL: 0 } },
      { productId: "running-shorts", inventory: { XS: 0, S: 1, M: 2, L: 1, XL: 0 } },
      { productId: "leggings", inventory: { XS: 0, S: 1, M: 1, L: 0, XL: 0 } },
      { productId: "running-shoes", inventory: { "38": 0, "39": 1, "40": 2, "41": 1, "42": 0, "43": 0 } },
    ],
  },
  {
    id: "asoke",
    name: "อโศก (BTS)",
    address: "ถ. สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ",
    lat: 13.7373,
    lng: 100.5608,
    type: "booth",
    openHours: "05:30 – 22:00",
    products: [
      { productId: "dri-fit-tee", inventory: { XS: 3, S: 4, M: 5, L: 3, XL: 2 } },
      { productId: "running-shorts", inventory: { XS: 2, S: 3, M: 4, L: 2, XL: 1 } },
      { productId: "leggings", inventory: { XS: 1, S: 2, M: 3, L: 2, XL: 1 } },
      { productId: "yoga-set", inventory: { XS: 1, S: 2, M: 2, L: 1, XL: 1 } },
      { productId: "running-shoes", inventory: { "38": 2, "39": 2, "40": 4, "41": 3, "42": 2, "43": 1 } },
      { productId: "training-shoes", inventory: { "38": 1, "39": 2, "40": 3, "41": 2, "42": 2, "43": 0 } },
    ],
  },
  {
    id: "samyan",
    name: "สามย่าน",
    address: "ถ. พญาไท แขวงวังใหม่ เขตปทุมวัน กรุงเทพฯ",
    lat: 13.7324,
    lng: 100.5271,
    type: "partner",
    partnerName: "Fitness First สามย่าน",
    openHours: "06:00 – 21:00",
    products: [
      { productId: "dri-fit-tee", inventory: { XS: 0, S: 1, M: 3, L: 2, XL: 1 } },
      { productId: "leggings", inventory: { XS: 0, S: 1, M: 2, L: 2, XL: 0 } },
      { productId: "yoga-set", inventory: { XS: 0, S: 1, M: 2, L: 1, XL: 0 } },
      { productId: "training-shoes", inventory: { "38": 0, "39": 1, "40": 2, "41": 1, "42": 1, "43": 0 } },
    ],
  },
  {
    id: "chatuchak",
    name: "สวนจตุจักร",
    address: "ถ. พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ",
    lat: 13.7999,
    lng: 100.5501,
    type: "booth",
    openHours: "05:00 – 19:00",
    products: [
      { productId: "dri-fit-tee", inventory: { XS: 2, S: 3, M: 4, L: 3, XL: 2 } },
      { productId: "running-shorts", inventory: { XS: 1, S: 2, M: 3, L: 2, XL: 1 } },
      { productId: "leggings", inventory: { XS: 1, S: 2, M: 3, L: 3, XL: 2 } },
      { productId: "yoga-set", inventory: { XS: 1, S: 1, M: 2, L: 2, XL: 1 } },
      { productId: "running-shoes", inventory: { "38": 1, "39": 2, "40": 3, "41": 3, "42": 2, "43": 1 } },
    ],
  },
  {
    id: "thonglor",
    name: "ทองหล่อ",
    address: "ถ. สุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ",
    lat: 13.7234,
    lng: 100.5785,
    type: "partner",
    partnerName: "Virgin Active ทองหล่อ",
    openHours: "06:00 – 22:00",
    products: [
      { productId: "dri-fit-tee", inventory: { XS: 1, S: 2, M: 2, L: 1, XL: 0 } },
      { productId: "running-shorts", inventory: { XS: 1, S: 1, M: 1, L: 0, XL: 0 } },
      { productId: "yoga-set", inventory: { XS: 0, S: 1, M: 1, L: 0, XL: 0 } },
      { productId: "running-shoes", inventory: { "38": 0, "39": 1, "40": 1, "41": 1, "42": 0, "43": 0 } },
      { productId: "training-shoes", inventory: { "38": 0, "39": 0, "40": 1, "41": 1, "42": 1, "43": 0 } },
    ],
  },
];

export function getStockTotal(inventory: SizeInventory): number {
  return Object.values(inventory).reduce((sum, qty) => sum + qty, 0);
}

export function getProductStock(
  products: LocationProductStock[],
  productId: string,
): SizeInventory | undefined {
  return products.find((p) => p.productId === productId)?.inventory;
}

export function getTotalStock(location: RentalLocation): number {
  return location.products.reduce(
    (sum, p) => sum + getStockTotal(p.inventory),
    0,
  );
}

export function getLocationById(id: string): RentalLocation | undefined {
  return rentalLocations.find((loc) => loc.id === id);
}

export type ProductAvailability = {
  location: RentalLocation;
  stock: LocationProductStock;
};

export function getLocationsWithProduct(
  productId: string,
): ProductAvailability[] {
  return rentalLocations
    .map((location) => {
      const stock = location.products.find((p) => p.productId === productId);
      if (!stock) return null;
      return { location, stock };
    })
    .filter((item): item is ProductAvailability => item !== null);
}

export function getTotalProductStock(
  productId: string,
  locations: RentalLocation[] = rentalLocations,
): number {
  return getStockTotal(getAggregatedProductInventory(productId, locations));
}

export function getAggregatedProductInventory(
  productId: string,
  locations: RentalLocation[] = rentalLocations,
): SizeInventory {
  const product = getProductById(productId);
  if (!product) return {};

  const inventory = Object.fromEntries(
    product.sizes.map((size) => [size, 0]),
  ) as SizeInventory;

  for (const location of locations) {
    const stock = location.products.find((p) => p.productId === productId);
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
  return locations
    .map((location) => {
      const stock = location.products.find((p) => p.productId === productId);
      if (!stock) return null;
      return { location, stock };
    })
    .filter((item): item is ProductAvailability => item !== null);
}
