import "server-only";

import {
  fetchCampaignById,
  fetchCampaignIds,
  fetchCampaigns,
} from "./data";
import type { Campaign } from "./types";

export async function getCampaigns(): Promise<Campaign[]> {
  return fetchCampaigns();
}

export async function getCampaignByIdAsync(
  id: string,
): Promise<Campaign | undefined> {
  return fetchCampaignById(id);
}

export async function getCampaignIds(): Promise<string[]> {
  return fetchCampaignIds();
}
