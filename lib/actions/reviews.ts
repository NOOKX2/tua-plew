"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { fetchProductById } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";
import { createProductReview } from "@/lib/reviews";
import type { ActionResult } from "./types";

export async function submitProductReviewAction(input: {
  productId: string;
  rating: number;
  comment: string;
}): Promise<ActionResult> {
  const t = await getTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: t("review.errors.loginRequired") };
  }

  const product = await fetchProductById(input.productId);

  if (!product) {
    return { ok: false, error: t("review.errors.productNotFound") };
  }

  const rating = Number(input.rating);
  const comment = input.comment.trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: t("review.errors.invalidRating") };
  }

  if (comment.length < 10) {
    return { ok: false, error: t("review.errors.commentTooShort") };
  }

  if (comment.length > 500) {
    return { ok: false, error: t("review.errors.commentTooLong") };
  }

  try {
    await createProductReview({
      userId: session.user.id,
      productId: input.productId,
      userName: session.user.name ?? t("common.user"),
      userImage: session.user.image ?? undefined,
      rating,
      comment,
    });

    revalidatePath(`/products/${input.productId}`);

    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: t("review.errors.submitFailed") };
  }
}
