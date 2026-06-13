import {
  fetchCampaignById,
  fetchCampaignIds,
  fetchCampaigns,
} from "./data";
import type { Campaign, CampaignType } from "./types";

export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  loyalty: "สะสมแต้ม",
  "first-time": "ลูกค้าใหม่",
  bundle: "แพ็กเกจ",
  seasonal: "ตามฤดูกาล",
};

export const CAMPAIGN_TYPE_EMOJI: Record<CampaignType, string> = {
  loyalty: "🎯",
  "first-time": "✨",
  bundle: "📦",
  seasonal: "☀️",
};

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

export function getCampaignById(
  id: string,
  campaigns: Campaign[],
): Campaign | undefined {
  return campaigns.find((campaign) => campaign.id === id);
}

export function getActiveCampaigns(
  list: Campaign[],
  asOf = new Date(),
): Campaign[] {
  return list.filter((campaign) => {
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    end.setHours(23, 59, 59, 999);
    return asOf >= start && asOf <= end;
  });
}

export function getFeaturedCampaigns(campaigns: Campaign[]): Campaign[] {
  return getActiveCampaigns(campaigns).filter((campaign) => campaign.featured);
}

export function formatCampaignPeriod(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const startStr = new Date(start).toLocaleDateString("th-TH", opts);
  const endStr = new Date(end).toLocaleDateString("th-TH", opts);
  return `${startStr} – ${endStr}`;
}

export function formatDiscount(percent: number): string {
  return `ลด ${percent}%`;
}
