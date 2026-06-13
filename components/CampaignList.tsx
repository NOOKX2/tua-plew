"use client";

import { useMemo, useState } from "react";
import type { Campaign, CampaignType } from "@/lib/types";
import { getActiveCampaigns } from "@/lib/campaigns";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getCampaignTypeLabel } from "@/lib/i18n/labels";
import CampaignCard from "./CampaignCard";

type Props = {
  campaigns: Campaign[];
  enrolledCampaignIds?: string[];
};

const ALL = "all" as const;
type Filter = typeof ALL | CampaignType;

export default function CampaignList({
  campaigns,
  enrolledCampaignIds = [],
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const [filter, setFilter] = useState<Filter>(ALL);

  const active = useMemo(() => getActiveCampaigns(campaigns), [campaigns]);

  const campaignTypes = useMemo(() => {
    const types = new Set(active.map((c) => c.campaignType));
    return [...types];
  }, [active]);

  const filtered = useMemo(() => {
    if (filter === ALL) return active;
    return active.filter((c) => c.campaignType === filter);
  }, [active, filter]);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterButton
          active={filter === ALL}
          onClick={() => setFilter(ALL)}
          label={t("common.all")}
        />
        {campaignTypes.map((type) => (
          <FilterButton
            key={type}
            active={filter === type}
            onClick={() => setFilter(type)}
            label={getCampaignTypeLabel(type, locale, messages)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          {t("common.noCampaignsInCategory")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              joined={enrolledCampaignIds.includes(campaign.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-amber-500 text-white"
          : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}
