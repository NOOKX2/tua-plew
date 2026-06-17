"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CommunityEvent, EventParticipant, Product, RentalLocation } from "@/lib/types";
import { ACTIVITY_EMOJI, ACTIVITY_GRADIENT } from "@/lib/community";
import { getAggregatedProductInventory, getStockTotal } from "@/lib/locations";
import { getProductById } from "@/lib/products";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import {
  formatEventDate,
  formatEventTime,
} from "@/lib/i18n/format";
import {
  getActivityLabel,
  getDifficultyLabel,
} from "@/lib/i18n/labels";
import CommunityJoinButton from "./CommunityJoinButton";
import EventParticipantsPanel from "./EventParticipantsPanel";
import StockBadge from "./StockBadge";
import { useUser } from "./UserProvider";

type Props = {
  event: CommunityEvent;
  location: RentalLocation | undefined;
  locations: RentalLocation[];
  products: Product[];
  joined?: boolean;
  participants?: EventParticipant[];
  currentUserId?: string | null;
  isAuthenticated?: boolean;
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

export default function CommunityDetail({
  event,
  location,
  locations,
  products,
  joined: joinedProp,
  participants = [],
  currentUserId: currentUserIdProp,
  isAuthenticated: isAuthenticatedProp,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const {
    enrolledEventIds,
    isAuthenticated: isAuthenticatedFromUser,
    sessionUser,
  } = useUser();
  const joined = joinedProp ?? enrolledEventIds.includes(event.id);
  const isAuthenticated = isAuthenticatedProp ?? isAuthenticatedFromUser;
  const currentUserId = currentUserIdProp ?? sessionUser?.id ?? null;
  const [participantCount, setParticipantCount] = useState(event.participantCount);
  const recommended = event.recommendedProductIds
    .map((id) => getProductById(id, products))
    .filter((product) => product !== undefined);

  const remaining = event.maxParticipants
    ? Math.max(0, event.maxParticipants - participantCount)
    : null;

  const fillPercent =
    event.maxParticipants && event.maxParticipants > 0
      ? Math.min(100, (participantCount / event.maxParticipants) * 100)
      : null;

  const activityGradient = ACTIVITY_GRADIENT[event.activityType];

  return (
    <main className="relative flex-1 overflow-x-hidden bg-[#faf9f6] pb-28 lg:pb-14">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-blue-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-64 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />

      <div className="relative overflow-x-hidden">
        <div className="relative min-h-[52vh] overflow-hidden lg:min-h-[62vh]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover lg:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/55 to-zinc-900/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent lg:max-w-[70%]" />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${activityGradient} opacity-20 mix-blend-overlay`}
          />

          <div className="home-hero-grid absolute inset-0 opacity-[0.07]" />

          <div className="absolute left-0 right-0 top-0 z-10 mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <Link
              href="/community"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              {t("community.backToList")}
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                {ACTIVITY_EMOJI[event.activityType]}{" "}
                {getActivityLabel(event.activityType, locale, messages)}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                {getDifficultyLabel(event.difficulty, locale, messages)}
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-8 sm:pb-12 lg:px-10 lg:pb-16">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300/90">
              Tua Plew Community
            </p>
            <h1 className="max-w-3xl break-words text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {event.shortDescription}
            </p>
          </div>
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="-mt-10 grid gap-3 sm:grid-cols-3 lg:-mt-14">
            <div className="rounded-2xl bg-white px-5 py-4 shadow-xl shadow-zinc-900/8 ring-1 ring-zinc-200/80">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {t("community.dateTime")}
              </p>
              <p className="mt-1.5 text-lg font-bold tracking-tight text-zinc-900">
                {formatEventDate(event.date, locale)}
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">
                {formatEventTime(
                  event.startTime,
                  event.endTime,
                  locale,
                  t("community.timeSuffix"),
                )}
              </p>
            </div>

            <Link
              href={`/community/${event.id}/participants`}
              className="block rounded-2xl bg-white px-5 py-4 shadow-xl shadow-zinc-900/8 ring-1 ring-zinc-200/80 transition-all hover:-translate-y-0.5 hover:ring-blue-300"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {t("community.participants.label")}
              </p>
              <p className="mt-1.5 text-lg font-bold tracking-tight text-zinc-900">
                {participantCount}
                {event.maxParticipants ? (
                  <span className="text-base font-medium text-zinc-400">
                    {" "}
                    / {event.maxParticipants}
                  </span>
                ) : null}{" "}
                <span className="text-sm font-medium text-zinc-500">
                  {t("common.people")}
                </span>
              </p>
              {remaining !== null && (
                <p className="mt-0.5 text-sm text-blue-600">
                  {t("common.spotsLeft", { count: remaining })}
                </p>
              )}
              <p className="mt-2 text-xs font-semibold text-blue-600">
                {t("community.participants.viewAll")} →
              </p>
            </Link>

            <div className="rounded-2xl bg-zinc-950 px-5 py-4 shadow-xl shadow-zinc-900/20">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {t("community.venue")}
              </p>
              <p className="mt-1.5 line-clamp-1 text-sm font-semibold text-white">
                {event.venue}
              </p>
              <p className="mt-0.5 line-clamp-1 text-xs text-zinc-400">
                {event.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-7xl min-w-0 px-4 sm:px-8 lg:mt-14 lg:px-10">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem]">
          <div className="min-w-0 space-y-6">
            <DetailBlock title={t("community.details")}>
              <p className="text-base leading-relaxed text-zinc-600">
                {event.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-950 px-3.5 py-1.5 text-xs font-semibold text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </DetailBlock>

            <section className="overflow-hidden rounded-[1.5rem] border border-blue-200/70 bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <div className="border-b border-blue-100 px-6 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  {t("community.social.chat.groupTitle")}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  {joined
                    ? t("community.social.chat.groupSubtitle")
                    : t("community.social.chat.joinToChat")}
                </p>
                {joined && (
                  <p className="mt-2 text-xs font-medium text-blue-700">
                    {t("community.social.chat.memberCount", {
                      count: participantCount,
                    })}
                  </p>
                )}
              </div>
              <div className="px-6 py-5">
                {joined ? (
                  <Link
                    href={`/community/${event.id}/chat`}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
                  >
                    💬 {t("community.social.chat.openGroup")}
                  </Link>
                ) : (
                  <p className="text-center text-sm text-zinc-500">
                    {t("community.social.chat.joinToChat")}
                  </p>
                )}
              </div>
            </section>

            {joined && currentUserId && (
              <div className="lg:hidden">
                <DetailBlock title={t("community.social.participants.title")}>
                  <EventParticipantsPanel
                    participants={participants}
                    currentUserId={currentUserId}
                  />
                  <Link
                    href={`/community/${event.id}/participants`}
                    className="mt-4 flex w-full items-center justify-center rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-300 hover:text-blue-700"
                  >
                    {t("community.participants.viewAll")} →
                  </Link>
                </DetailBlock>
              </div>
            )}

            <DetailBlock title={t("community.venue")}>
              <p className="text-lg font-bold tracking-tight text-zinc-900">
                {event.venue}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{event.address}</p>
              <p className="mt-4 text-xs uppercase tracking-wider text-zinc-400">
                {t("common.organizedBy")}
              </p>
              <p className="mt-1 font-semibold text-zinc-800">{event.organizer}</p>
              {location && (
                <Link
                  href={`/map?location=${location.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  {t("common.viewOnMapArrow")}
                </Link>
              )}
            </DetailBlock>

            {recommended.length > 0 && (
              <section className="min-w-0 overflow-hidden">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      Gear up
                    </p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
                      {t("community.recommendedGear")}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {t("community.recommendedHint")}
                    </p>
                  </div>
                </div>

                <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
                  {recommended.map((product) => {
                    const total = getStockTotal(
                      getAggregatedProductInventory(
                        product.id,
                        locations,
                        products,
                      ),
                    );
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group w-[min(72vw,240px)] shrink-0 snap-start overflow-hidden rounded-[1.25rem] border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/8"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-zinc-100 to-zinc-50">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                            sizes="240px"
                          />
                        </div>
                        <div className="border-t border-zinc-100 p-4">
                          <p className="line-clamp-2 text-sm font-bold leading-snug text-zinc-900">
                            {product.name}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-zinc-900">
                              ฿{product.pricePerRental}
                              <span className="text-xs font-normal text-zinc-400">
                                {t("common.perRental")}
                              </span>
                            </p>
                            <StockBadge
                              total={total}
                              unit={product.sizeUnit}
                              size="sm"
                            />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[1.5rem] bg-zinc-950 text-white shadow-2xl shadow-zinc-900/25">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  {t("community.join")}
                </p>
                {fillPercent !== null && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">{t("community.capacity")}</span>
                      <span className="font-semibold text-white">
                        {Math.round(fillPercent)}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-300 transition-all duration-500"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>
                )}
                {remaining !== null && (
                  <p className="mt-3 text-sm text-zinc-400">
                    {t("common.spotsLeft", { count: remaining })}
                  </p>
                )}
              </div>
              <div className="px-6 py-5">
                <CommunityJoinButton
                  event={{ ...event, participantCount }}
                  initialJoined={joined}
                  onJoined={setParticipantCount}
                  onLeft={setParticipantCount}
                  variant="premium"
                  isAuthenticated={isAuthenticated}
                />
                {joined && (
                  <Link
                    href={`/community/${event.id}/chat`}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
                  >
                    {t("community.social.chat.openGroup")}
                  </Link>
                )}
              </div>
            </div>

            {joined && currentUserId && (
              <div className="hidden lg:block">
                <DetailBlock title={t("community.social.participants.title")}>
                  <EventParticipantsPanel
                    participants={participants}
                    currentUserId={currentUserId}
                  />
                  <Link
                    href={`/community/${event.id}/participants`}
                    className="mt-4 flex w-full items-center justify-center rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-300 hover:text-blue-700"
                  >
                    {t("community.participants.viewAll")} →
                  </Link>
                </DetailBlock>
              </div>
            )}

            {location && (
              <div className="overflow-hidden rounded-[1.5rem] border border-blue-200/60 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700/80">
                  {t("community.nearbyRental")}
                </p>
                <p className="mt-2 text-lg font-bold tracking-tight text-zinc-900">
                  {location.name}
                </p>
                <p className="mt-1 text-sm text-zinc-500">{location.address}</p>
                <p className="mt-3 text-xs leading-relaxed text-blue-800/80">
                  {t("community.nearbyRentalHint", { hours: location.openHours })}
                </p>
                <Link
                  href={`/map?location=${location.id}${recommended[0] ? `&product=${recommended[0].id}` : ""}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-zinc-800"
                >
                  {t("community.findNearbyRental")}
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 max-w-full overflow-hidden border-t border-zinc-200/80 bg-white/95 p-4 backdrop-blur-md lg:hidden">
        <CommunityJoinButton
          event={{ ...event, participantCount }}
          initialJoined={joined}
          onJoined={setParticipantCount}
          onLeft={setParticipantCount}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </main>
  );
}
