import "server-only";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongoose";
import { RentalReservation as RentalReservationModel } from "@/lib/models";

export async function getActiveRentalCountForSession(): Promise<number> {
  const session = await auth();

  if (!session?.user?.id) {
    return 0;
  }

  await connectDB();
  return RentalReservationModel.countDocuments({
    userId: session.user.id,
    status: "pending_pickup",
    expiresAt: { $gt: new Date() },
  });
}
