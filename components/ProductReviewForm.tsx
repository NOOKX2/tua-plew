"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitProductReviewAction } from "@/lib/actions/reviews";
import { useTranslations } from "@/lib/i18n/client";
import StarRating from "./StarRating";

type Props = {
  productId: string;
  hasReviewed?: boolean;
  callbackUrl?: string;
  isAuthenticated?: boolean;
};

export default function ProductReviewForm({
  productId,
  hasReviewed = false,
  callbackUrl,
  isAuthenticated = false,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(hasReviewed);

  const loginHref = `/login?callbackUrl=${encodeURIComponent(
    callbackUrl ?? `/products/${productId}`,
  )}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await submitProductReviewAction({
      productId,
      rating,
      comment,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
    setComment("");
    router.refresh();
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="mb-3 text-sm text-zinc-600">{t("review.loginPrompt")}</p>
        <Link
          href={loginHref}
          className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {t("review.loginToReview")}
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-700">
          <span aria-hidden>✓ </span>
          {t("review.submitted")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          {t("review.ratingLabel")}
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-medium text-zinc-700"
        >
          {t("review.commentLabel")}
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder={t("review.commentPlaceholder")}
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          required
        />
        <p className="mt-1 text-xs text-zinc-400">
          {t("review.commentHint")}
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t("review.submitting") : t("review.submit")}
      </button>
    </form>
  );
}
