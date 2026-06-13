import type { Product } from "./types";

export function getProductById(
  id: string,
  products: Product[],
): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(
  id: string,
  products: Product[],
  limit = 3,
): Product[] {
  return products.filter((product) => product.id !== id).slice(0, limit);
}
