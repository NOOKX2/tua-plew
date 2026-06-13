"use client";

import type { ProductRatingSummary, ProductReview } from "@/lib/types";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import ProductReviewForm from "./ProductReviewForm";
import StarRating from "./StarRating";

type Props = {
  productId: string;
  reviews: ProductReview[];
  ratingSummary: ProductRatingSummary;
  hasReviewed?: boolean;
};

function formatReviewDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProductReviewSection({
  productId,
  reviews,
  ratingSummary,
  hasReviewed = false,
}: Props) {
  const t = useTranslations();
  const { locale } = useLocale();

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
      <div className="border-b border-zinc-100 bg-zinc-50/80 px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-900">
          {t("review.title")}
        </h2>
        {ratingSummary.count > 0 && (
          <div className="mt-1 flex items-center gap-2">
            <StarRating rating={ratingSummary.averageRating} size="sm" />
            <span className="text-xs text-zinc-500">
              {t("review.summary", {
                rating: ratingSummary.averageRating,
                count: ratingSummary.count,
              })}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 px-5 py-5">
        <ProductReviewForm
          productId={productId}
          hasReviewed={hasReviewed}
        />

        {reviews.length === 0 ? (
          <p className="text-sm text-zinc-500">{t("review.empty")}</p>
        ) : (
          <ul className="space-y-3 border-t border-zinc-100 pt-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-lg bg-zinc-50 p-3"
              >
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-900">
                    {review.userName}
                  </p>
                  <time
                    dateTime={review.createdAt}
                    className="text-xs text-zinc-400"
                  >
                    {formatReviewDate(review.createdAt, locale)}
                  </time>
                </div>
                <StarRating rating={review.rating} size="sm" />
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {review.comment}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
