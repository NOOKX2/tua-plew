import type { Product } from "./types";

export type ApparelTier = "essential" | "studio" | "tactical";

export const APPAREL_TIER_ORDER: ApparelTier[] = [
  "essential",
  "studio",
  "tactical",
];

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
