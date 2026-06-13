import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchProductById } from "@/lib/data";
import { createProductReview } from "@/lib/reviews";
import { getTranslatorFromRequest } from "@/lib/i18n/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const t = getTranslatorFromRequest(request);
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: t("review.errors.loginRequired") },
      { status: 401 },
    );
  }

  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return NextResponse.json(
      { error: t("review.errors.productNotFound") },
      { status: 404 },
    );
  }

  let body: { rating?: number; comment?: string };
  try {
    body = (await request.json()) as { rating?: number; comment?: string };
  } catch {
    return NextResponse.json(
      { error: t("review.errors.invalidData") },
      { status: 400 },
    );
  }

  const rating = Number(body.rating);
  const comment = body.comment?.trim() ?? "";

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: t("review.errors.invalidRating") },
      { status: 400 },
    );
  }

  if (comment.length < 10) {
    return NextResponse.json(
      { error: t("review.errors.commentTooShort") },
      { status: 400 },
    );
  }

  if (comment.length > 500) {
    return NextResponse.json(
      { error: t("review.errors.commentTooLong") },
      { status: 400 },
    );
  }

  try {
    const review = await createProductReview({
      userId: session.user.id,
      productId: id,
      userName: session.user.name ?? t("common.user"),
      userImage: session.user.image ?? undefined,
      rating,
      comment,
    });

    return NextResponse.json({ review });
  } catch {
    return NextResponse.json(
      { error: t("review.errors.submitFailed") },
      { status: 500 },
    );
  }
}
