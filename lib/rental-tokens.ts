import "server-only";

import type {
  RentalPaymentMethod,
  RentalTokenTransaction,
  RentalTokenTransactionType,
} from "./types";
import { connectDB } from "./mongoose";
import { RentalTokenTransaction as RentalTokenTransactionModel, User } from "./models";

export const WELCOME_TOKEN_BONUS = 100;

type TokenRow = {
  _id: { toString(): string };
  userId: string;
  amount: number;
  type: RentalTokenTransactionType;
  rentalId?: string | null;
  description?: string | null;
  createdAt: Date;
};

function mapTransaction(row: TokenRow): RentalTokenTransaction {
  return {
    id: row._id.toString(),
    userId: row.userId,
    amount: row.amount,
    type: row.type,
    rentalId: row.rentalId ?? undefined,
    description: row.description ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export function getRentalTokenCost(pricePerRental: number): number {
  return pricePerRental;
}

export function resolveRentalTokenPayment(input: {
  paymentMethod: RentalPaymentMethod;
  pricePerRental: number;
  tokensToUse?: number;
  balance: number;
}): number {
  const { paymentMethod, pricePerRental, tokensToUse, balance } = input;

  if (paymentMethod === "cash" || paymentMethod === "subscription") return 0;

  if (paymentMethod === "tokens") {
    if (balance < pricePerRental) throw new Error("INSUFFICIENT_TOKENS");
    return pricePerRental;
  }

  const amount = tokensToUse ?? 0;
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount >= pricePerRental ||
    !Number.isInteger(amount)
  ) {
    throw new Error("INVALID_TOKEN_AMOUNT");
  }

  if (amount > balance) throw new Error("INSUFFICIENT_TOKENS");
  return amount;
}

export async function getRentalTokenBalance(userId: string): Promise<number> {
  await connectDB();
  const user = await User.findById(userId).select("rentalTokenBalance").lean();
  return user?.rentalTokenBalance ?? 0;
}

export async function getRecentRentalTokenTransactions(
  userId: string,
  limit = 5,
): Promise<RentalTokenTransaction[]> {
  await connectDB();
  const rows = await RentalTokenTransactionModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<TokenRow[]>();

  return rows.map(mapTransaction);
}

async function recordTransaction(input: {
  userId: string;
  amount: number;
  type: RentalTokenTransactionType;
  rentalId?: string;
  description?: string;
}): Promise<void> {
  await RentalTokenTransactionModel.create(input);
}

export async function grantWelcomeBonus(userId: string): Promise<void> {
  await connectDB();

  const existing = await RentalTokenTransactionModel.findOne({
    userId,
    type: "welcome",
  }).lean();

  if (existing) return;

  const result = await User.updateOne(
    { _id: userId },
    { $inc: { rentalTokenBalance: WELCOME_TOKEN_BONUS } },
  );

  if (result.matchedCount !== 1) return;

  await recordTransaction({
    userId,
    amount: WELCOME_TOKEN_BONUS,
    type: "welcome",
    description: "welcome",
  });
}

export async function debitRentalTokens(input: {
  userId: string;
  amount: number;
  rentalId: string;
}): Promise<void> {
  if (input.amount <= 0) return;

  await connectDB();

  const result = await User.updateOne(
    { _id: input.userId, rentalTokenBalance: { $gte: input.amount } },
    { $inc: { rentalTokenBalance: -input.amount } },
  );

  if (result.modifiedCount !== 1) {
    throw new Error("INSUFFICIENT_TOKENS");
  }

  await recordTransaction({
    userId: input.userId,
    amount: -input.amount,
    type: "spend",
    rentalId: input.rentalId,
    description: "rental",
  });
}

export async function creditRentalTokens(input: {
  userId: string;
  amount: number;
  type: Extract<RentalTokenTransactionType, "refund" | "earn" | "topup">;
  rentalId?: string;
  description?: string;
}): Promise<void> {
  if (input.amount <= 0) return;

  await connectDB();

  await User.updateOne(
    { _id: input.userId },
    { $inc: { rentalTokenBalance: input.amount } },
  );

  await recordTransaction({
    userId: input.userId,
    amount: input.amount,
    type: input.type,
    rentalId: input.rentalId,
    description: input.description,
  });
}

export async function refundRentalTokensForReservation(input: {
  userId: string;
  tokensSpent: number;
  rentalId: string;
}): Promise<void> {
  if (input.tokensSpent <= 0) return;

  await creditRentalTokens({
    userId: input.userId,
    amount: input.tokensSpent,
    type: "refund",
    rentalId: input.rentalId,
    description: "refund",
  });
}

export async function topUpRentalTokens(input: {
  userId: string;
  amount: number;
}): Promise<number> {
  if (input.amount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  await creditRentalTokens({
    userId: input.userId,
    amount: input.amount,
    type: "topup",
    description: "topup",
  });

  return getRentalTokenBalance(input.userId);
}
