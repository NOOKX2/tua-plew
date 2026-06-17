import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignDetail from "@/components/CampaignDetail";
import { CATALOG_PAGE_REVALIDATE } from "@/lib/catalog-revalidate";
import { getCampaignEnrollmentCount } from "@/lib/campaign-enrollments";
import {
  getCampaignByIdAsync,
  getCampaignIds,
} from "@/lib/campaigns.server";
import { staticT } from "@/lib/i18n/static";
import { getRentalLocations } from "@/lib/locations.server";

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = CATALOG_PAGE_REVALIDATE;

export async function generateStaticParams() {
  const ids = await getCampaignIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaignByIdAsync(id);

  if (!campaign) {
    return { title: staticT("meta.campaignNotFound") };
  }

  return {
    title: `${campaign.title} | Tua Plew`,
    description: campaign.shortDescription,
  };
}

export default async function CampaignPage({ params }: Props) {
  const { id } = await params;
  const campaign = await getCampaignByIdAsync(id);
  if (!campaign) {
    notFound();
  }

  const [rentalLocations, enrollmentCount] = await Promise.all([
    getRentalLocations(),
    getCampaignEnrollmentCount(id),
  ]);

  const partnerLocations = rentalLocations.filter((location) =>
    campaign.partnerLocationIds.includes(location.id),
  );

  return (
    <CampaignDetail
      campaign={campaign}
      partnerLocations={partnerLocations}
      enrollmentCount={enrollmentCount}
    />
  );
}
