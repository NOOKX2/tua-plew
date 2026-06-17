"use client";

import { useMemo, useState } from "react";
import type { Campaign, CampaignType, CampaignProgress } from "@/lib/types";
import { getActiveCampaigns } from "@/lib/campaigns";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getCampaignTypeLabel } from "@/lib/i18n/labels";
import CampaignCard from "./CampaignCard";
import FilterMenu from "./FilterMenu";
import { useUser } from "./UserProvider";

type Props = {
  campaigns: Campaign[];
  enrolledCampaignIds?: string[];
  progressByCampaignId?: Record<string, CampaignProgress>;
  isAuthenticated?: boolean;
};

const ALL = "all" as const;
type Filter = typeof ALL | CampaignType;

export default function CampaignList({
  campaigns,
  enrolledCampaignIds: enrolledCampaignIdsProp,
  progressByCampaignId = {},
  isAuthenticated: isAuthenticatedProp,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const {
    enrolledCampaignIds: enrolledFromUser,
    isAuthenticated: isAuthenticatedFromUser,
  } = useUser();
  const enrolledCampaignIds = enrolledCampaignIdsProp ?? enrolledFromUser;
  const isAuthenticated = isAuthenticatedProp ?? isAuthenticatedFromUser;
  const [filter, setFilter] = useState<Filter>(ALL);

  const active = useMemo(() => getActiveCampaigns(campaigns), [campaigns]);

  const campaignTypes = useMemo(() => {
    const types = new Set(active.map((c) => c.campaignType));
    return [...types];
  }, [active]);

  const filterOptions = useMemo(
    () => [
      { id: ALL, label: t("common.all") },
      ...campaignTypes.map((type) => ({
        id: type,
        label: getCampaignTypeLabel(type, locale, messages),
      })),
    ],
    [campaignTypes, locale, messages, t],
  );

  const filtered = useMemo(() => {
    if (filter === ALL) return active;
    return active.filter((c) => c.campaignType === filter);
  }, [active, filter]);

  return (
    <>
      <FilterMenu
        value={filter}
        options={filterOptions}
        onChange={setFilter}
        allValue={ALL}
      />

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
              progress={progressByCampaignId[campaign.id] ?? null}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </>
  );
}
