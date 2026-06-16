"use client";

import Image from "next/image";
import Link from "next/link";
import type { Campaign } from "@/lib/types";
import type { CampaignProgress } from "@/lib/types";
import { CAMPAIGN_TYPE_EMOJI } from "@/lib/campaigns";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { formatCampaignPeriod } from "@/lib/i18n/format";
import {
  formatDiscount,
  getCampaignTypeLabel,
} from "@/lib/i18n/labels";
import CampaignJoinButton from "./CampaignJoinButton";
import CampaignProgressBar from "./CampaignProgressBar";

type Props = {
  campaign: Campaign;
  joined?: boolean;
  progress?: CampaignProgress | null;
};

export default function CampaignCard({
  campaign,
  joined = false,
  progress = null,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-amber-300 hover:shadow-md">
      <Link
        href={`/campaigns/${campaign.id}`}
        className="group flex flex-1 flex-col"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {formatDiscount(campaign.discountPercent, locale, messages)}
          </span>
          {joined && (
            <span className="absolute right-3 top-3 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              ✓ {t("campaign.joined")}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <span className="mb-2 inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
              {CAMPAIGN_TYPE_EMOJI[campaign.campaignType]}{" "}
              {getCampaignTypeLabel(campaign.campaignType, locale, messages)}
            </span>
            <h3 className="text-lg font-bold leading-snug drop-shadow-sm group-hover:underline">
              {campaign.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-white/90">
              {campaign.shortDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex flex-wrap gap-2 text-xs text-zinc-600">
            <span className="rounded-md bg-zinc-100 px-2 py-1">
              📅 {formatCampaignPeriod(campaign.startDate, campaign.endDate, locale)}
            </span>
            {campaign.requiredRentals && (
              <span className="rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-700">
                {t("campaign.rentCount", { count: campaign.requiredRentals })}
              </span>
            )}
            <span className="rounded-md bg-zinc-100 px-2 py-1">
              {t("campaign.partnerCount", {
                count: campaign.partnerLocationIds.length,
              })}
            </span>
          </div>

          {joined && progress && (
            <CampaignProgressBar progress={progress} variant="compact" />
          )}

          <div className="mt-auto flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              {campaign.campaignType === "loyalty"
                ? t("campaign.loyaltyCta")
                : t("campaign.instantCta")}
            </span>
            <span className="text-xs font-medium text-amber-600">
              {t("common.viewDetails")}
            </span>
          </div>
        </div>
      </Link>

      <div className="border-t border-zinc-100 px-4 py-3">
        <CampaignJoinButton
          campaign={campaign}
          initialJoined={joined}
          compact
          callbackUrl={`/campaigns/${campaign.id}`}
        />
      </div>
    </div>
  );
}
