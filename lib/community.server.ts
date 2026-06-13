import "server-only";

import {
  fetchCommunityEventById,
  fetchCommunityEventIds,
  fetchCommunityEvents,
} from "./data";
import type { CommunityEvent } from "./types";

export async function getCommunityEvents(): Promise<CommunityEvent[]> {
  return fetchCommunityEvents();
}

export async function getCommunityEventByIdAsync(
  id: string,
): Promise<CommunityEvent | undefined> {
  return fetchCommunityEventById(id);
}

export async function getCommunityEventIds(): Promise<string[]> {
  return fetchCommunityEventIds();
}
