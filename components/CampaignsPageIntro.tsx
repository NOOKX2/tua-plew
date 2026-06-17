"use client";

import { useTranslations } from "@/lib/i18n/client";

export default function CampaignsPageIntro() {
  const t = useTranslations();

  return (
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
  );
}
