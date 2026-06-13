import "server-only";

import type { ProductRatingSummary, ProductReview } from "./types";
import { connectDB } from "./mongoose";
import { Review } from "./models";

type ReviewRow = {
  _id: { toString(): string };
  userId: string;
  productId: string;
  userName: string;
  userImage?: string | null;
  rating: number;
  comment: string;
  createdAt: Date;
};

function mapReview(row: ReviewRow): ProductReview {
  return {
    id: row._id.toString(),
    userId: row.userId,
    productId: row.productId,
    userName: row.userName,
    userImage: row.userImage ?? undefined,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function fetchReviewsByProductId(
  productId: string,
): Promise<ProductReview[]> {
  await connectDB();
  const rows = await Review.find({ productId })
    .sort({ createdAt: -1 })
    .lean<ReviewRow[]>();
  return rows.map(mapReview);
}

export async function getProductRatingSummary(
  productId: string,
): Promise<ProductRatingSummary> {
  await connectDB();
  const rows = await Review.aggregate<{ _id: null; avg: number; count: number }>([
    { $match: { productId } },
    {
      $group: {
        _id: null,
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!rows.length) {
    return { averageRating: 0, count: 0 };
  }

  return {
    averageRating: Math.round(rows[0].avg * 10) / 10,
    count: rows[0].count,
  };
}

export async function getProductRatingSummaries(
  productIds: string[],
): Promise<Record<string, ProductRatingSummary>> {
  if (!productIds.length) return {};

  await connectDB();
  const rows = await Review.aggregate<{
    _id: string;
    avg: number;
    count: number;
  }>([
    { $match: { productId: { $in: productIds } } },
    {
      $group: {
        _id: "$productId",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const summaries: Record<string, ProductRatingSummary> = {};
  for (const row of rows) {
    summaries[row._id] = {
      averageRating: Math.round(row.avg * 10) / 10,
      count: row.count,
    };
  }
  return summaries;
}

export async function hasUserReviewedProduct(
  userId: string,
  productId: string,
): Promise<boolean> {
  await connectDB();
  const row = await Review.findOne({ userId, productId }).select("_id").lean();
  return Boolean(row);
}

export async function createProductReview(input: {
  userId: string;
  productId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
}): Promise<ProductReview> {
  await connectDB();

  const existing = await Review.findOne({
    userId: input.userId,
    productId: input.productId,
  }).lean<ReviewRow | null>();

  if (existing) {
    return mapReview(existing);
  }

  const review = await Review.create({
    userId: input.userId,
    productId: input.productId,
    userName: input.userName,
    userImage: input.userImage,
    rating: input.rating,
    comment: input.comment.trim(),
  });

  return mapReview(review.toObject() as ReviewRow);
}
