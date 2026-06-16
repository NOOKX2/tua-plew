import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignDetail from "@/components/CampaignDetail";
import { auth } from "@/auth";
import {
  getCampaignEnrollmentCount,
  isUserEnrolledInCampaign,
} from "@/lib/campaign-enrollments";
import { getCampaignProgressForUser } from "@/lib/campaign-progress";
import {
  getCampaignByIdAsync,
} from "@/lib/campaigns.server";
import { getTranslator } from "@/lib/i18n/server";
import { getRentalLocations } from "@/lib/locations.server";
import { getCampaignIds } from "@/lib/campaigns.server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getCampaignIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [campaign, t] = await Promise.all([
    getCampaignByIdAsync(id),
    getTranslator(),
  ]);

  if (!campaign) {
    return { title: t("meta.campaignNotFound") };
  }

  return {
    title: `${campaign.title} | Tua Plew`,
    description: campaign.shortDescription,
  };
}

export default async function CampaignPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const campaign = await getCampaignByIdAsync(id);
  if (!campaign) {
    notFound();
  }

  const [rentalLocations, joined, enrollmentCount, progress] =
    await Promise.all([
      getRentalLocations(),
      session?.user?.id
        ? isUserEnrolledInCampaign(session.user.id, id)
        : Promise.resolve(false),
      getCampaignEnrollmentCount(id),
      session?.user?.id
        ? getCampaignProgressForUser(session.user.id, campaign)
        : Promise.resolve(null),
    ]);

  const partnerLocations = rentalLocations.filter((location) =>
    campaign.partnerLocationIds.includes(location.id),
  );

  return (
    <CampaignDetail
      campaign={campaign}
      partnerLocations={partnerLocations}
      joined={joined}
      enrollmentCount={enrollmentCount}
      progress={progress}
    />
  );
}
