import "server-only";

import type { Campaign, CampaignProgress } from "./types";
import { connectDB } from "./mongoose";
import { RentalReservation } from "./models";
import { isUserEnrolledInCampaign } from "./campaign-enrollments";

type RentalCountRow = {
  locationId: string;
  reservedAt: Date;
};

function getCampaignDateRange(campaign: Campaign) {
  const start = new Date(campaign.startDate);
  const end = new Date(campaign.endDate);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function getCampaignProgressTarget(campaign: Campaign): number {
  return campaign.requiredRentals ?? 1;
}

function countQualifyingRentals(
  rentals: RentalCountRow[],
  campaign: Campaign,
): number {
  const { start, end } = getCampaignDateRange(campaign);
  const partnerIds = new Set(campaign.partnerLocationIds);

  return rentals.filter((rental) => {
    if (!partnerIds.has(rental.locationId)) return false;
    const reservedAt = new Date(rental.reservedAt);
    return reservedAt >= start && reservedAt <= end;
  }).length;
}

function buildProgress(current: number, target: number): CampaignProgress {
  const capped = Math.min(current, target);
  return {
    current: capped,
    target,
    percent: target > 0 ? Math.min(100, Math.round((capped / target) * 100)) : 0,
    complete: capped >= target,
  };
}

export async function getCampaignProgressForUser(
  userId: string,
  campaign: Campaign,
): Promise<CampaignProgress | null> {
  const enrolled = await isUserEnrolledInCampaign(userId, campaign.id);
  if (!enrolled) return null;

  await connectDB();
  const rentals = await RentalReservation.find({
    userId,
    status: "returned",
  })
    .select("locationId reservedAt")
    .lean<RentalCountRow[]>();

  const current = countQualifyingRentals(rentals, campaign);
  return buildProgress(current, getCampaignProgressTarget(campaign));
}

export async function getCampaignProgressMapForUser(
  userId: string,
  campaigns: Campaign[],
): Promise<Record<string, CampaignProgress>> {
  const enrolledChecks = await Promise.all(
    campaigns.map(async (campaign) => ({
      campaign,
      enrolled: await isUserEnrolledInCampaign(userId, campaign.id),
    })),
  );

  const enrolledCampaigns = enrolledChecks
    .filter((item) => item.enrolled)
    .map((item) => item.campaign);

  if (enrolledCampaigns.length === 0) {
    return {};
  }

  await connectDB();
  const rentals = await RentalReservation.find({
    userId,
    status: "returned",
  })
    .select("locationId reservedAt")
    .lean<RentalCountRow[]>();

  const progressMap: Record<string, CampaignProgress> = {};
  for (const campaign of enrolledCampaigns) {
    const current = countQualifyingRentals(rentals, campaign);
    progressMap[campaign.id] = buildProgress(
      current,
      getCampaignProgressTarget(campaign),
    );
  }

  return progressMap;
}
