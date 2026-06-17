import type { LocationProductStock, Product } from "./types";

export type ApparelTier = "essential" | "studio" | "tactical";

export const APPAREL_TIER_ORDER: ApparelTier[] = [
  "essential",
  "studio",
  "tactical",
];

export const APPAREL_TIER_ACCENT: Record<ApparelTier, string> = {
  essential: "bg-blue-500",
  studio: "bg-violet-500",
  tactical: "bg-zinc-800",
};

export type TierStockItem = {
  stock: LocationProductStock;
  product: Product;
};

export type TierStockGroup = {
  tier: ApparelTier;
  items: TierStockItem[];
};

const TIER_BY_PRODUCT_ID: Record<string, ApparelTier> = {
  "dri-fit-tee": "essential",
  "running-shorts": "essential",
  "running-shoes": "essential",
  "nike-pegasus": "essential",
  "nb-1080": "essential",
  "on-cloudrunner": "essential",
  leggings: "studio",
  "yoga-set": "studio",
  "training-shoes": "tactical",
  "adidas-ultraboost": "tactical",
};

export function getProductTier(product: Product): ApparelTier {
  return TIER_BY_PRODUCT_ID[product.id] ?? "essential";
}

export function groupStocksByApparelTier(
  stocks: LocationProductStock[],
  products: Product[],
): TierStockGroup[] {
  return APPAREL_TIER_ORDER.map((tier) => ({
    tier,
    items: stocks.flatMap((stock) => {
      const product = products.find((p) => p.id === stock.productId);
      if (!product || getProductTier(product) !== tier) return [];
      return [{ stock, product }];
    }),
  })).filter((group) => group.items.length > 0);
}
