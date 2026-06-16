import "server-only";

import { auth } from "@/auth";
import { getUserRentalReservations } from "@/lib/rentals";
import { isReservationActive } from "@/lib/rental-status";

export async function getActiveRentalCountForSession(): Promise<number> {
  const session = await auth();

  if (!session?.user?.id) {
    return 0;
  }

  const rentals = await getUserRentalReservations(session.user.id);
  return rentals.filter(isReservationActive).length;
}
