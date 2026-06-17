import "server-only";

import type { RentalReservation } from "./types";
import { connectDB } from "./mongoose";
import { RentalReservation as RentalReservationModel } from "./models";
import { expirePendingReservations } from "./rentals";
import { getUserProfilesByIds } from "./users.server";

type RentalRow = {
  _id: { toString(): string };
  userId: string;
  productId: string;
  locationId: string;
  size: string;
  status: string;
  pickupCode: string;
  price: number;
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
    status: row.status as RentalReservation["status"],
    pickupCode: row.pickupCode,
    price: row.price,
    productName: row.productName,
    locationName: row.locationName,
    locationAddress: row.locationAddress,
    reservedAt: row.reservedAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
    pickedUpAt: row.pickedUpAt?.toISOString(),
    cancelledAt: row.cancelledAt?.toISOString(),
  };
}

export type RentalCheckoutPeer = {
  userId: string;
  name: string;
  image?: string;
  size: string;
  reservedAt: string;
};

export async function getRentalReservationForUser(
  rentalId: string,
  userId: string,
): Promise<RentalReservation | null> {
  await connectDB();
  await expirePendingReservations();

  const row = await RentalReservationModel.findOne({
    _id: rentalId,
    userId,
  }).lean<RentalRow | null>();

  return row ? mapRental(row) : null;
}

export async function getRentalCheckoutPeers(
  productId: string,
  locationId: string,
): Promise<RentalCheckoutPeer[]> {
  await connectDB();
  await expirePendingReservations();

  const rows = await RentalReservationModel.find({
    productId,
    locationId,
    status: "pending_pickup",
    expiresAt: { $gt: new Date() },
  })
    .sort({ reservedAt: -1 })
    .lean<Pick<RentalRow, "userId" | "size" | "reservedAt">[]>();

  if (rows.length === 0) return [];

  const userIds = [...new Set(rows.map((row) => row.userId))];
  const profiles = await getUserProfilesByIds(userIds);
  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));

  const peers: RentalCheckoutPeer[] = [];

  for (const row of rows) {
    const profile = profilesById.get(row.userId);
    if (!profile) continue;

    peers.push({
      userId: row.userId,
      name: profile.name,
      size: row.size,
      reservedAt: row.reservedAt.toISOString(),
      ...(profile.image ? { image: profile.image } : {}),
    });
  }

  return peers;
}
