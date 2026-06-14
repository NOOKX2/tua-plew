"use client";

import Image from "next/image";
import Link from "next/link";
import type { Campaign, RentalLocation } from "@/lib/types";
import {
  CAMPAIGN_TYPE_EMOJI,
  CAMPAIGN_TYPE_GRADIENT,
} from "@/lib/campaigns";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { formatCampaignPeriod } from "@/lib/i18n/format";
import {
  formatDiscount,
  getCampaignTypeLabel,
} from "@/lib/i18n/labels";
import CampaignJoinButton from "./CampaignJoinButton";

type Props = {
  campaign: Campaign;
  partnerLocations: RentalLocation[];
  joined?: boolean;
  enrollmentCount?: number;
};

function DetailBlock({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-white shadow-sm ${className}`}
    >
      <div className="border-b border-zinc-100 px-6 py-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {title}
        </h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

export default function CampaignDetail({
  campaign,
  partnerLocations,
  joined = false,
  enrollmentCount = 0,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const typeGradient = CAMPAIGN_TYPE_GRADIENT[campaign.campaignType];
  const discountLabel = formatDiscount(
    campaign.discountPercent,
    locale,
    messages,
  );

  return (
    <main className="relative flex-1 bg-[#faf9f6] pb-28 lg:pb-14">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-amber-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-64 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />

      <div className="relative">
        <div className="relative min-h-[52vh] overflow-hidden lg:min-h-[62vh]">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            priority
            sizes="100vw"
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/55 to-zinc-900/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent lg:max-w-[70%]" />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${typeGradient} opacity-25 mix-blend-overlay`}
          />

          <div className="home-hero-grid absolute inset-0 opacity-[0.07]" />

          <div className="absolute left-0 right-0 top-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8 lg:px-10">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              {t("campaign.backToList")}
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-950">
                {discountLabel}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                {CAMPAIGN_TYPE_EMOJI[campaign.campaignType]}{" "}
                {getCampaignTypeLabel(campaign.campaignType, locale, messages)}
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-8 sm:pb-12 lg:px-10 lg:pb-16">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/90">
              Tua Plew Campaign
            </p>
            <h1 className="max-w-3xl text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {campaign.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {campaign.shortDescription}
            </p>
          </div>
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="-mt-10 grid gap-3 sm:grid-cols-3 lg:-mt-14">
            <div className="rounded-2xl bg-white px-5 py-4 shadow-xl shadow-zinc-900/8 ring-1 ring-zinc-200/80">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {t("campaign.period")}
              </p>
              <p className="mt-1.5 text-sm font-bold leading-snug tracking-tight text-zinc-900 sm:text-base">
                {formatCampaignPeriod(
                  campaign.startDate,
                  campaign.endDate,
                  locale,
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 px-5 py-4 shadow-xl shadow-amber-900/20">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-950/70">
                {t("campaign.discount")}
              </p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-950">
                {discountLabel}
              </p>
              {campaign.requiredRentals ? (
                <p className="mt-0.5 text-xs font-medium text-amber-950/80">
                  {t("campaign.discountWhenRentals", {
                    count: campaign.requiredRentals,
                  })}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl bg-zinc-950 px-5 py-4 shadow-xl shadow-zinc-900/20">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {t("campaign.partners", { count: partnerLocations.length })}
              </p>
              <p className="mt-1.5 text-sm font-bold leading-snug text-white">
                {t("campaign.partnerCount", { count: partnerLocations.length })}
              </p>
              {enrollmentCount > 0 && (
                <p className="mt-0.5 text-xs text-amber-300/90">
                  {t("campaign.participantsJoined", { count: enrollmentCount })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-8 lg:mt-14 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem]">
          <div className="min-w-0 space-y-6">
            <DetailBlock title={t("campaign.details")}>
              <p className="text-base leading-relaxed text-zinc-600">
                {campaign.description}
              </p>
            </DetailBlock>

            {campaign.requiredRentals && (
              <section className="overflow-hidden rounded-[1.5rem] border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50/40 shadow-sm">
                <div className="border-b border-amber-200/50 px-6 py-4">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800/80">
                    {t("campaign.howToClaim")}
                  </h2>
                </div>
                <ol className="divide-y divide-amber-200/40">
                  {[
                    t("campaign.step1"),
                    t("campaign.step2"),
                    t("campaign.step3", {
                      rentals: campaign.requiredRentals,
                      percent: campaign.discountPercent,
                    }),
                  ].map((step, index) => (
                    <li
                      key={step}
                      className="flex gap-4 px-6 py-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-sm leading-relaxed text-amber-950/90">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <DetailBlock title={t("campaign.partners", { count: partnerLocations.length })}>
              <ul className="space-y-3">
                {partnerLocations.map((location) => (
                  <li key={location.id}>
                    <Link
                      href={`/map?location=${location.id}`}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/80 px-5 py-4 transition-all hover:border-amber-300 hover:bg-white hover:shadow-md hover:shadow-zinc-900/5"
                    >
                      <div className="min-w-0">
                        <p className="font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-amber-800">
                          {location.name}
                        </p>
                        {location.partnerName && (
                          <p className="mt-0.5 text-sm text-zinc-500">
                            {location.partnerName}
                          </p>
                        )}
                        <p className="mt-1 line-clamp-1 text-xs text-zinc-400">
                          {location.address}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-zinc-950 px-3 py-1.5 text-[11px] font-bold text-white transition-colors group-hover:bg-amber-500 group-hover:text-zinc-950">
                        {t("common.viewOnMap")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailBlock>

            <DetailBlock title={t("campaign.terms")}>
              <ul className="space-y-3">
                {campaign.terms.map((term) => (
                  <li
                    key={term}
                    className="flex gap-3 text-sm leading-relaxed text-zinc-600"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {term}
                  </li>
                ))}
              </ul>
            </DetailBlock>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[1.5rem] bg-zinc-950 text-white shadow-2xl shadow-zinc-900/25">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  {t("campaign.join")}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-amber-300">
                  {discountLabel}
                </p>
                {enrollmentCount > 0 && (
                  <p className="mt-2 text-sm text-zinc-400">
                    {t("campaign.participantsJoined", { count: enrollmentCount })}
                  </p>
                )}
              </div>
              <div className="px-6 py-5">
                <CampaignJoinButton
                  campaign={campaign}
                  initialJoined={joined}
                  variant="premium"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                {t("campaign.period")}
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-900">
                {formatCampaignPeriod(
                  campaign.startDate,
                  campaign.endDate,
                  locale,
                )}
              </p>
              <Link
                href="/map"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-bold text-zinc-800 transition-all hover:border-zinc-900 hover:bg-zinc-950 hover:text-white"
              >
                {t("common.viewOnMapArrow")}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/80 bg-white/95 p-4 backdrop-blur-md lg:hidden">
        <CampaignJoinButton campaign={campaign} initialJoined={joined} />
      </div>
    </main>
  );
}
