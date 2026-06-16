"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { enrollUserInCampaign } from "@/lib/campaign-enrollments";
import { isCampaignActive, isCampaignUpcoming } from "@/lib/campaigns";
import { fetchCampaignById } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";
import type { ActionResult } from "./types";

export async function joinCampaignAction(
  campaignId: string,
): Promise<ActionResult> {
  const t = await getTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: t("campaign.errors.loginRequired") };
  }

  const campaign = await fetchCampaignById(campaignId);

  if (!campaign) {
    return { ok: false, error: t("campaign.errors.notFound") };
  }

  if (isCampaignUpcoming(campaign)) {
    return { ok: false, error: t("campaign.errors.notStarted") };
  }

  if (!isCampaignActive(campaign)) {
    return { ok: false, error: t("campaign.errors.ended") };
  }

  await enrollUserInCampaign(session.user.id, campaignId);

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${campaignId}`);

  return { ok: true, data: undefined };
}
