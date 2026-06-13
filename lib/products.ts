import {
  fetchProductById,
  fetchProductIds,
  fetchProducts,
} from "./data";
import type { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  return fetchProducts();
}

export async function getProductByIdAsync(
  id: string,
): Promise<Product | undefined> {
  return fetchProductById(id);
}

export async function getProductIds(): Promise<string[]> {
  return fetchProductIds();
}

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
