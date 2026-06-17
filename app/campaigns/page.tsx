import type { Metadata } from "next";
import CampaignList from "@/components/CampaignList";
import { getCampaigns } from "@/lib/campaigns.server";
import { staticT } from "@/lib/i18n/static";

export const revalidate = 60;

export const metadata: Metadata = {
  title: staticT("meta.campaignsTitle"),
  description: staticT("meta.campaignsDescription"),
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  const t = staticT;

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

      <CampaignList campaigns={campaigns} />
    </main>
  );
}
