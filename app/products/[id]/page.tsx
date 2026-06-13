import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProductById, products } from "@/lib/products";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "ไม่พบสินค้า | Fit-to-Go" };
  }

  return {
    title: `${product.name} | Fit-to-Go`,
    description: product.description,
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { from } = await searchParams;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} compact={from === "map"} />;
}
