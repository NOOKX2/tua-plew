import "server-only";

import crypto from "crypto";
import type { RentalPaymentMethod, RentalReservation, RentalStatus } from "./types";
import { isReservationActive } from "./rental-status";
import {
  debitRentalTokens,
  getRentalTokenBalance,
  refundRentalTokensForReservation,
  resolveRentalTokenPayment,
} from "./rental-tokens";
import {
  canUseSubscriptionCredit,
  consumeSubscriptionCredit,
  refundSubscriptionCredit,
} from "./subscription";
import { connectDB } from "./mongoose";
import {
  LocationStock,
  Product,
  RentalLocation,
  RentalReservation as RentalReservationModel,
} from "./models";

const PICKUP_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_PENDING_PER_USER = 3;

type RentalRow = {
  _id: { toString(): string };
  userId: string;
  productId: string;
  locationId: string;
  size: string;
  status: RentalStatus;
  pickupCode: string;
  price: number;
  paymentMethod?: RentalPaymentMethod;
  tokensSpent?: number;
  productName: string;
  locationName: string;
  locationAddress: string;
  reservedAt: Date;
  expiresAt: Date;
  pickedUpAt?: Date | null;
  cancelledAt?: Date | null;
};

function mapRental(row: RentalRow): RentalReservation {
  return {
    id: row._id.toString(),
    userId: row.userId,
    productId: row.productId,
    locationId: row.locationId,
    size: row.size,
    status: row.status,
    pickupCode: row.pickupCode,
    price: row.price,
    paymentMethod: row.paymentMethod ?? "cash",
    tokensSpent: row.tokensSpent ?? 0,
    productName: row.productName,
    locationName: row.locationName,
    locationAddress: row.locationAddress,
    reservedAt: row.reservedAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
    pickedUpAt: row.pickedUpAt?.toISOString(),
    cancelledAt: row.cancelledAt?.toISOString(),
  };
}

function generatePickupCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

async function decrementStock(
  locationId: string,
  productId: string,
  size: string,
): Promise<boolean> {
  const inventoryKey = `inventory.${size}`;
  const result = await LocationStock.updateOne(
    {
      locationId,
      productId,
      [inventoryKey]: { $gte: 1 },
    },
    { $inc: { [inventoryKey]: -1 } },
  );
  return result.modifiedCount === 1;
}

async function incrementStock(
  locationId: string,
  productId: string,
  size: string,
): Promise<void> {
  const inventoryKey = `inventory.${size}`;
  await LocationStock.updateOne(
    { locationId, productId },
    { $inc: { [inventoryKey]: 1 } },
  );
}

async function refundTokensIfNeeded(row: RentalRow): Promise<void> {
  if (row.paymentMethod === "subscription") {
    await refundSubscriptionCredit(row.userId);
    return;
  }

  if (!row.tokensSpent || row.tokensSpent <= 0) return;

  await refundRentalTokensForReservation({
    userId: row.userId,
    tokensSpent: row.tokensSpent,
    rentalId: row._id.toString(),
  });
}

export async function expirePendingReservations(): Promise<number> {
  await connectDB();
  const now = new Date();
  const expired = await RentalReservationModel.find({
    status: "pending_pickup",
    expiresAt: { $lte: now },
  }).lean<RentalRow[]>();

  for (const row of expired) {
    await incrementStock(row.locationId, row.productId, row.size);
    await refundTokensIfNeeded(row);
    await RentalReservationModel.updateOne(
      { _id: row._id },
      { $set: { status: "expired" } },
    );
  }

  return expired.length;
}

export async function createRentalReservation(input: {
  userId: string;
  productId: string;
  locationId: string;
  size: string;
  paymentMethod?: RentalPaymentMethod;
  tokensToUse?: number;
}): Promise<RentalReservation> {
  await connectDB();
  await expirePendingReservations();

  const paymentMethod = input.paymentMethod ?? "cash";

  const pendingCount = await RentalReservationModel.countDocuments({
    userId: input.userId,
    status: "pending_pickup",
    expiresAt: { $gt: new Date() },
  });

  if (pendingCount >= MAX_PENDING_PER_USER) {
    throw new Error("TOO_MANY_PENDING");
  }

  const [product, location] = await Promise.all([
    Product.findById(input.productId).lean(),
    RentalLocation.findById(input.locationId).lean(),
  ]);

  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  if (!location) throw new Error("LOCATION_NOT_FOUND");
  if (!product.sizes.includes(input.size)) throw new Error("INVALID_SIZE");

  if (paymentMethod === "subscription") {
    const canUse = await canUseSubscriptionCredit(input.userId);
    if (!canUse) throw new Error("NO_SUBSCRIPTION_CREDIT");
  }

  const balance = await getRentalTokenBalance(input.userId);
  const tokensSpent = resolveRentalTokenPayment({
    paymentMethod,
    pricePerRental: product.pricePerRental,
    tokensToUse: input.tokensToUse,
    balance,
  });

  const reservedAt = new Date();
  const expiresAt = new Date(reservedAt.getTime() + PICKUP_TTL_MS);

  const stockReserved = await decrementStock(
    input.locationId,
    input.productId,
    input.size,
  );
  if (!stockReserved) throw new Error("OUT_OF_STOCK");

  try {
    for (let attempt = 0; attempt < 5; attempt++) {
      const pickupCode = generatePickupCode();
      try {
        const doc = await RentalReservationModel.create({
          userId: input.userId,
          productId: input.productId,
          locationId: input.locationId,
          size: input.size,
          status: "pending_pickup",
          pickupCode,
          price: product.pricePerRental,
          paymentMethod,
          tokensSpent,
          productName: product.name,
          locationName: location.name,
          locationAddress: location.address,
          reservedAt,
          expiresAt,
        });

        if (tokensSpent > 0) {
          try {
            await debitRentalTokens({
              userId: input.userId,
              amount: tokensSpent,
              rentalId: doc._id.toString(),
            });
          } catch (error) {
            await RentalReservationModel.deleteOne({ _id: doc._id });
            throw error;
          }
        }

        if (paymentMethod === "subscription") {
          try {
            await consumeSubscriptionCredit(
              input.userId,
              doc._id.toString(),
            );
          } catch (error) {
            await RentalReservationModel.deleteOne({ _id: doc._id });
            throw error;
          }
        }

        return mapRental(doc.toObject() as RentalRow);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          (error as { code?: number }).code === 11000
        ) {
          continue;
        }
        throw error;
      }
    }
    throw new Error("CREATE_FAILED");
  } catch (error) {
    await incrementStock(input.locationId, input.productId, input.size);
    throw error;
  }
}

export async function cancelRentalReservation(
  userId: string,
  rentalId: string,
): Promise<RentalReservation> {
  await connectDB();

  const rental = await RentalReservationModel.findOne({
    _id: rentalId,
    userId,
  });

  if (!rental) throw new Error("NOT_FOUND");
  if (rental.status !== "pending_pickup") {
    throw new Error("NOT_CANCELLABLE");
  }
  if (rental.expiresAt <= new Date()) throw new Error("EXPIRED");

  rental.status = "cancelled";
  rental.cancelledAt = new Date();
  await rental.save();

  await incrementStock(rental.locationId, rental.productId, rental.size);
  await refundTokensIfNeeded(rental.toObject() as RentalRow);

  return mapRental(rental.toObject() as RentalRow);
}

export async function getUserRentalReservations(
  userId: string,
): Promise<RentalReservation[]> {
  await connectDB();
  await expirePendingReservations();

  const rows = await RentalReservationModel.find({ userId })
    .sort({ reservedAt: -1 })
    .limit(50)
    .lean<RentalRow[]>();

  return rows.map(mapRental);
}

export async function getUserActiveReservations(
  userId: string,
): Promise<RentalReservation[]> {
  const all = await getUserRentalReservations(userId);
  return all.filter(isReservationActive);
}

export async function countUserActiveReservations(
  userId: string,
): Promise<number> {
  await connectDB();
  await expirePendingReservations();
  return RentalReservationModel.countDocuments({
    userId,
    status: "pending_pickup",
    expiresAt: { $gt: new Date() },
  });
}
