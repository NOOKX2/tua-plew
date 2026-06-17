import type { Metadata } from "next";
import CampaignsPageIntro from "@/components/CampaignsPageIntro";
import CampaignList from "@/components/CampaignList";
import { getCampaigns } from "@/lib/campaigns.server";
import { getLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = createTranslator(locale);
  return {
    title: t("meta.campaignsTitle"),
    description: t("meta.campaignsDescription"),
  };
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <CampaignsPageIntro />
      <CampaignList campaigns={campaigns} />
    </main>
  );
}
