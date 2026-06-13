import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { enrollUserInCampaign } from "@/lib/campaign-enrollments";
import { fetchCampaignById } from "@/lib/data";
import { isCampaignActive, isCampaignUpcoming } from "@/lib/campaigns";
import { getTranslatorFromRequest } from "@/lib/i18n/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const t = getTranslatorFromRequest(_request);
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: t("campaign.errors.loginRequired") },
      { status: 401 },
    );
  }

  const { id } = await params;
  const campaign = await fetchCampaignById(id);

  if (!campaign) {
    return NextResponse.json(
      { error: t("campaign.errors.notFound") },
      { status: 404 },
    );
  }

  if (isCampaignUpcoming(campaign)) {
    return NextResponse.json(
      { error: t("campaign.errors.notStarted") },
      { status: 400 },
    );
  }

  if (!isCampaignActive(campaign)) {
    return NextResponse.json(
      { error: t("campaign.errors.ended") },
      { status: 400 },
    );
  }

  const { joinedAt } = await enrollUserInCampaign(session.user.id, id);

  return NextResponse.json({
    joined: true,
    joinedAt: joinedAt.toISOString(),
  });
}
