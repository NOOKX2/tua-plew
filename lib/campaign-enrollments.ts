import "server-only";

import { connectDB } from "./mongoose";
import { CampaignEnrollment } from "./models";

export async function enrollUserInCampaign(
  userId: string,
  campaignId: string,
): Promise<{ joinedAt: Date }> {
  await connectDB();

  const existing = await CampaignEnrollment.findOne({ userId, campaignId }).lean();
  if (existing) {
    return { joinedAt: existing.joinedAt as Date };
  }

  const enrollment = await CampaignEnrollment.create({ userId, campaignId });
  return { joinedAt: enrollment.joinedAt };
}

export async function isUserEnrolledInCampaign(
  userId: string,
  campaignId: string,
): Promise<boolean> {
  await connectDB();
  const row = await CampaignEnrollment.findOne({ userId, campaignId })
    .select("_id")
    .lean();
  return Boolean(row);
}

export async function getCampaignEnrollmentCount(
  campaignId: string,
): Promise<number> {
  await connectDB();
  return CampaignEnrollment.countDocuments({ campaignId });
}

export async function getUserEnrolledCampaignIds(
  userId: string,
): Promise<string[]> {
  await connectDB();
  const rows = await CampaignEnrollment.find({ userId })
    .select("campaignId")
    .lean();
  return rows.map((row) => row.campaignId as string);
}
