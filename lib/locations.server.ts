import "server-only";

import { fetchLocationById, fetchLocations, fetchLocationsFresh } from "./data";
import type { RentalLocation } from "./types";

export async function getRentalLocations(): Promise<RentalLocation[]> {
  return fetchLocations();
}

export async function getRentalLocationsFresh(): Promise<RentalLocation[]> {
  return fetchLocationsFresh();
}

export async function getLocationByIdAsync(
  id: string,
): Promise<RentalLocation | undefined> {
  return fetchLocationById(id);
}
