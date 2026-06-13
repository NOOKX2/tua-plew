import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignDetail from "@/components/CampaignDetail";
import {
  getCampaignByIdAsync,
} from "@/lib/campaigns.server";
import { getRentalLocations } from "@/lib/locations.server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaignByIdAsync(id);

  if (!campaign) {
    return { title: "ไม่พบแคมเปญ | Tua Plew" };
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
