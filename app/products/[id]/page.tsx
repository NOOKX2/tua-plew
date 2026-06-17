import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { CATALOG_PAGE_REVALIDATE } from "@/lib/catalog-revalidate";
import { getRentalLocations } from "@/lib/locations.server";
import {
  getProductByIdAsync,
  getProductIds,
  getProducts,
} from "@/lib/products.server";
import {
  fetchReviewsByProductId,
  getProductRatingSummary,
} from "@/lib/reviews";
import { staticT } from "@/lib/i18n/static";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export const revalidate = CATALOG_PAGE_REVALIDATE;

export async function generateStaticParams() {
  const ids = await getProductIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdAsync(id);

  if (!product) {
    return { title: staticT("meta.productNotFound") };
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

  const [reviews, ratingSummary] = product.isPartnerBrand
    ? await Promise.all([
        fetchReviewsByProductId(id),
        getProductRatingSummary(id),
      ])
    : [[], { averageRating: 0, count: 0 }];

  return (
    <ProductDetail
      product={product}
      products={products}
      locations={locations}
      compact={from === "map"}
      reviews={reviews}
      ratingSummary={ratingSummary}
    />
  );
}
