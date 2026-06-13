import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignDetail from "@/components/CampaignDetail";
import {
  getCampaignByIdAsync,
} from "@/lib/campaigns.server";
import { getTranslator } from "@/lib/i18n/server";
import { getRentalLocations } from "@/lib/locations.server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

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
  const [campaign, rentalLocations] = await Promise.all([
    getCampaignByIdAsync(id),
    getRentalLocations(),
  ]);

  if (!campaign) {
    notFound();
  }

  const partnerLocations = rentalLocations.filter((location) =>
    campaign.partnerLocationIds.includes(location.id),
  );

  return (
    <CampaignDetail
      campaign={campaign}
      partnerLocations={partnerLocations}
    />
  );
}
