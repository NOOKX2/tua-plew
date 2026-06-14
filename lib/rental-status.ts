import type { RentalReservation } from "./types";

export function isReservationActive(rental: RentalReservation): boolean {
  return (
    rental.status === "pending_pickup" &&
    new Date(rental.expiresAt) > new Date()
  );
}
