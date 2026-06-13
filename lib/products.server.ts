import "server-only";

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
