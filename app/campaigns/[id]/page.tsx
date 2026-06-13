import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignDetail from "@/components/CampaignDetail";
import { campaigns, getCampaignById } from "@/lib/campaigns";
import { rentalLocations } from "@/lib/locations";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return campaigns.map((campaign) => ({ id: campaign.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const campaign = getCampaignById(id);

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
  const campaign = getCampaignById(id);

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
