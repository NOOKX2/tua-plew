"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product, ProductRatingSummary, ProductReview, RentalLocation } from "@/lib/types";
import {
  getAggregatedProductInventory,
  getLocationsWithProduct,
  getTotalProductStock,
} from "@/lib/locations";
import { getRelatedProducts } from "@/lib/products";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getCategoryLabel } from "@/lib/i18n/labels";
import ProductAvailabilityList from "./ProductAvailabilityList";
import ProductReviewSection from "./ProductReviewSection";
import RentalBookingPanel from "./RentalBookingPanel";
import SizeInventory from "./SizeInventory";
import StockBadge from "./StockBadge";
import StarRating from "./StarRating";

type Props = {
  product: Product;
  products: Product[];
  locations: RentalLocation[];
  compact?: boolean;
  reviews?: ProductReview[];
  ratingSummary?: ProductRatingSummary;
  hasReviewed?: boolean;
};

function DetailSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm ${className}`}
    >
      <div className="border-b border-zinc-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export default function ProductDetail({
  product,
  products,
  locations,
  compact = false,
  reviews = [],
  ratingSummary = { averageRating: 0, count: 0 },
  hasReviewed = false,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const availability = getLocationsWithProduct(product.id, locations);
  const aggregatedInventory = getAggregatedProductInventory(
    product.id,
    locations,
    products,
  );
  const totalStock = getTotalProductStock(product.id, locations, products);
  const related = getRelatedProducts(product.id, products);
  const isShoe = product.category === "shoe";
  const hasWaist = product.sizeGuide.some((row) => row.waist);
  const hasChest = product.sizeGuide.some((row) => row.chest);
  const categoryLabel = getCategoryLabel(product.category, locale, messages);
  const isPartner = product.isPartnerBrand;

  return (
    <main className="relative flex-1 bg-[#faf9f6] pb-24 lg:pb-10">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-40 h-56 w-56 rounded-full bg-teal-200/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={compact ? "/map" : "/"}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            {compact ? t("common.backToMap") : t("product.backToCatalog")}
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${isPartner
                  ? "bg-amber-400 text-zinc-900"
                  : "bg-white text-zinc-700 ring-1 ring-zinc-200"
                }`}
            >
              {isPartner && product.brand ? product.brand : categoryLabel}
            </span>
            {isPartner && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800">
                {t("product.partnerBrand")}
              </span>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5">
          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            <div
              className={`relative p-6 sm:p-8 lg:sticky lg:top-24 lg:self-start ${isPartner
                  ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950"
                  : "bg-gradient-to-br from-zinc-100 via-white to-emerald-50/40"
                }`}
            >
              <div className="home-hero-grid absolute inset-0 opacity-30" />

              <div
                className={`relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[1.5rem] ${isPartner
                    ? "bg-zinc-900/50 ring-1 ring-white/10"
                    : "bg-white shadow-lg ring-1 ring-zinc-200/60"
                  }`}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8 sm:p-10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute bottom-4 right-4">
                  <StockBadge
                    total={totalStock}
                    unit={product.sizeUnit}
                    size="lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                {product.name}
              </h1>

              {ratingSummary.count > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <StarRating rating={ratingSummary.averageRating} size="md" />
                  <span className="text-sm text-zinc-500">
                    {t("review.summary", {
                      rating: ratingSummary.averageRating,
                      count: ratingSummary.count,
                    })}
                  </span>
                </div>
              )}

              <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
                {compact ? product.description : product.longDescription}
              </p>

              {!compact && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.activities.map((activity) => (
                    <span
                      key={activity}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-zinc-950 px-4 py-3 text-white">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                    {t("product.rentalPrice")}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-300">
                    ฿{product.pricePerRental}
                    <span className="text-sm font-normal text-zinc-400">
                      {" "}
                      {t("common.perRental")}
                    </span>
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    {t("stock.totalAllLocations")}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">
                    {totalStock}
                    <span className="text-sm font-normal text-zinc-500">
                      {" "}
                      {product.sizeUnit}
                    </span>
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    {t("product.locationsAvailable")}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">
                    {availability.length}
                    <span className="text-sm font-normal text-zinc-500">
                      {" "}
                      {t("product.locationsUnit")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {t("stock.remainingBySize")}
                </p>
                <SizeInventory
                  inventory={aggregatedInventory}
                  sizes={product.sizes}
                  unit={product.sizeUnit}
                />
              </div>

              <RentalBookingPanel
                product={product}
                availability={availability}
                callbackUrl={`/products/${product.id}${compact ? "?from=map" : ""}`}
              />

              <Link
                href={`/map?product=${product.id}`}
                className="mt-6 hidden items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] hover:bg-emerald-400 lg:inline-flex"
              >
                {t("product.findNearby")}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <DetailSection title={t("product.moreDetails")}>
            {!compact && (
              <p className="mb-4 text-sm leading-relaxed text-zinc-600">
                {product.longDescription}
              </p>
            )}
            <dl className="mb-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-100">
                <dt className="text-xs text-zinc-500">{t("common.color")}</dt>
                <dd className="font-medium text-zinc-900">{product.color}</dd>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-100">
                <dt className="text-xs text-zinc-500">{t("product.material")}</dt>
                <dd className="font-medium text-zinc-900">{product.material}</dd>
              </div>
            </dl>
            <ul className="space-y-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 rounded-lg bg-emerald-50/60 px-3 py-2 text-sm text-zinc-700"
                >
                  <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title={t("product.sizeGuide")}>
            <div className="overflow-x-auto rounded-xl ring-1 ring-zinc-100">
              <table className="w-full min-w-[280px] text-sm">
                <thead className="bg-zinc-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold text-zinc-700">
                      {isShoe ? t("product.sizeEu") : t("product.size")}
                    </th>
                    {isShoe ? (
                      <th className="px-4 py-3 font-semibold text-zinc-700">
                        {t("product.footLength")}
                      </th>
                    ) : (
                      <>
                        {hasChest && (
                          <th className="px-4 py-3 font-semibold text-zinc-700">
                            {t("product.chest")}
                          </th>
                        )}
                        {hasWaist && (
                          <th className="px-4 py-3 font-semibold text-zinc-700">
                            {t("product.waist")}
                          </th>
                        )}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {product.sizeGuide.map((row) => (
                    <tr
                      key={row.size}
                      className="border-t border-zinc-100 last:border-0"
                    >
                      <td className="px-4 py-2.5 font-semibold text-zinc-900">
                        {row.size}
                      </td>
                      {isShoe ? (
                        <td className="px-4 py-2.5 text-zinc-600">
                          {row.footLength ?? "—"}
                        </td>
                      ) : (
                        <>
                          {hasChest && (
                            <td className="px-4 py-2.5 text-zinc-600">
                              {row.chest ?? "—"}
                            </td>
                          )}
                          {hasWaist && (
                            <td className="px-4 py-2.5 text-zinc-600">
                              {row.waist ?? "—"}
                            </td>
                          )}
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailSection>

          <DetailSection title={t("product.hygiene")}>
            <div className="rounded-xl bg-emerald-50/50 p-4 ring-1 ring-emerald-100">
              <p className="text-sm leading-relaxed text-zinc-700">
                {product.careNote}
              </p>
            </div>
          </DetailSection>

          {!compact && (
            <DetailSection
              title={t("product.availability", { count: availability.length })}
            >
              <ProductAvailabilityList items={availability} product={product} />
            </DetailSection>
          )}
        </div>

        {!compact && related.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="text-lg font-bold text-zinc-900">
                {t("product.related")}
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group min-w-[42%] shrink-0 snap-start overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg sm:min-w-[28%] lg:min-w-[22%]"
                >
                  <div className="relative aspect-square bg-gradient-to-b from-zinc-100 to-zinc-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      sizes="180px"
                    />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-semibold text-zinc-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-emerald-600">
                      ฿{item.pricePerRental}
                      {t("common.perRental")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!compact && product.isPartnerBrand && (
          <div className="mt-8">
            <ProductReviewSection
              productId={product.id}
              reviews={reviews}
              ratingSummary={ratingSummary}
              hasReviewed={hasReviewed}
            />
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/80 bg-white/95 p-4 backdrop-blur-md lg:hidden">
        <Link
          href={`/map?product=${product.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20"
        >
          {t("product.findNearby")}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}
