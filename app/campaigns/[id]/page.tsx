import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignDetail from "@/components/CampaignDetail";
import {
  getCampaignByIdAsync,
  getCampaignIds,
} from "@/lib/campaigns";
import { getRentalLocations } from "@/lib/locations";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getCampaignIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaignByIdAsync(id);

  if (!campaign) {
    return { title: "ไม่พบแคมเปญ | Fit-to-Go" };
  }

  return {
    title: `${campaign.title} | Fit-to-Go`,
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
