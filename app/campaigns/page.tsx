import type { Metadata } from "next";
import CampaignList from "@/components/CampaignList";
import { auth } from "@/auth";
import { getUserEnrolledCampaignIds } from "@/lib/campaign-enrollments";
import { getCampaigns } from "@/lib/campaigns.server";
import { getTranslator } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.campaignsTitle"),
    description: t("meta.campaignsDescription"),
  };
}

export default async function CampaignsPage() {
  const session = await auth();
  const [campaigns, t, enrolledCampaignIds] = await Promise.all([
    getCampaigns(),
    getTranslator(),
    session?.user?.id
      ? getUserEnrolledCampaignIds(session.user.id)
      : Promise.resolve([] as string[]),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-amber-600">
          Tua Plew Campaigns
        </p>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
          {t("campaign.title")}
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500 sm:text-base">
          {t("campaign.subtitle")}
        </p>
      </div>

      <CampaignList
        campaigns={campaigns}
        enrolledCampaignIds={enrolledCampaignIds}
      />
    </main>
  );
}
