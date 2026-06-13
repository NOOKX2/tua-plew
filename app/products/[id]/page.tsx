import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getRentalLocations } from "@/lib/locations.server";
import {
  getProductByIdAsync,
  getProducts,
} from "@/lib/products.server";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [product, t] = await Promise.all([
    getProductByIdAsync(id),
    getTranslator(),
  ]);

  if (!product) {
    return { title: t("meta.productNotFound") };
  }

  return {
    title: `${product.name} | Tua Plew`,
    description: product.description,
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { from } = await searchParams;
  const [product, products, locations] = await Promise.all([
    getProductByIdAsync(id),
    getProducts(),
    getRentalLocations(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetail
      product={product}
      products={products}
      locations={locations}
      compact={from === "map"}
    />
  );
}
