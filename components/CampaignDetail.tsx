"use client";

import Image from "next/image";
import Link from "next/link";
import type { Campaign, RentalLocation } from "@/lib/types";
import { CAMPAIGN_TYPE_EMOJI } from "@/lib/campaigns";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { formatCampaignPeriod } from "@/lib/i18n/format";
import {
  formatDiscount,
  getCampaignTypeLabel,
} from "@/lib/i18n/labels";

type Props = {
  campaign: Campaign;
  partnerLocations: RentalLocation[];
};

export default function CampaignDetail({ campaign, partnerLocations }: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="relative aspect-[21/9] w-full sm:aspect-[2.5/1]">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-bold">
              {formatDiscount(campaign.discountPercent, locale, messages)}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              {CAMPAIGN_TYPE_EMOJI[campaign.campaignType]}{" "}
              {getCampaignTypeLabel(campaign.campaignType, locale, messages)}
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-bold drop-shadow-sm sm:text-3xl">
            {campaign.title}
          </h1>
          <p className="text-white/90">{campaign.shortDescription}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            {t("campaign.period")}
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">
            {formatCampaignPeriod(campaign.startDate, campaign.endDate, locale)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            {t("campaign.discount")}
          </p>
          <p className="mt-1 text-sm font-semibold text-amber-600">
            {formatDiscount(campaign.discountPercent, locale, messages)}
            {campaign.requiredRentals
              ? t("campaign.discountWhenRentals", {
                  count: campaign.requiredRentals,
                })
              : ""}
          </p>
        </div>
      </div>

      <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">
          {t("campaign.details")}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          {campaign.description}
        </p>
      </section>

      {campaign.requiredRentals && (
        <section className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="mb-3 text-sm font-semibold text-amber-900">
            {t("campaign.howToClaim")}
          </h2>
          <ol className="space-y-2 text-sm text-amber-900/90">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              {t("campaign.step1")}
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              {t("campaign.step2")}
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              {t("campaign.step3", {
                rentals: campaign.requiredRentals,
                percent: campaign.discountPercent,
              })}
            </li>
          </ol>
        </section>
      )}

      <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">
          {t("campaign.partners", { count: partnerLocations.length })}
        </h2>
        <ul className="space-y-2">
          {partnerLocations.map((location) => (
            <li key={location.id}>
              <Link
                href={`/map?location=${location.id}`}
                className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 transition-colors hover:border-amber-200 hover:bg-amber-50/50"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {location.name}
                  </p>
                  {location.partnerName && (
                    <p className="text-xs text-zinc-500">
                      {location.partnerName}
                    </p>
                  )}
                </div>
                <span className="text-xs font-medium text-amber-600">
                  {t("common.viewOnMapArrow")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">
          {t("campaign.terms")}
        </h2>
        <ul className="space-y-2">
          {campaign.terms.map((term) => (
            <li
              key={term}
              className="flex gap-2 text-sm leading-relaxed text-zinc-600"
            >
              <span className="text-zinc-400">•</span>
              {term}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
