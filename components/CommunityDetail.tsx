"use client";

import Image from "next/image";
import Link from "next/link";
import type { CommunityEvent, Product, RentalLocation } from "@/lib/types";
import { ACTIVITY_EMOJI, spotsLeft } from "@/lib/community";
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
import StockBadge from "./StockBadge";

type Props = {
  event: CommunityEvent;
  location: RentalLocation | undefined;
  locations: RentalLocation[];
  products: Product[];
};

export default function CommunityDetail({
  event,
  location,
  locations,
  products,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const recommended = event.recommendedProductIds
    .map((id) => getProductById(id, products))
    .filter((product) => product !== undefined);

  const remaining = spotsLeft(event);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="relative aspect-[21/9] w-full sm:aspect-[2.5/1]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              {ACTIVITY_EMOJI[event.activityType]}{" "}
              {getActivityLabel(event.activityType, locale, messages)}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
              {getDifficultyLabel(event.difficulty, locale, messages)}
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-bold drop-shadow-sm sm:text-3xl">
            {event.title}
          </h1>
          <p className="text-white/90">{event.shortDescription}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            {t("community.dateTime")}
          </p>
          <p className="mt-1 font-semibold text-zinc-900">
            {formatEventDate(event.date, locale)}
          </p>
          <p className="text-sm text-zinc-600">
            {formatEventTime(
              event.startTime,
              event.endTime,
              locale,
              t("community.timeSuffix"),
            )}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            {t("community.participants")}
          </p>
          <p className="mt-1 font-semibold text-zinc-900">
            {event.participantCount}
            {event.maxParticipants ? ` / ${event.maxParticipants}` : ""}{" "}
            {t("common.people")}
          </p>
          {remaining !== null && (
            <p className="text-sm text-zinc-600">
              {t("common.spotsLeft", { count: remaining })}
            </p>
          )}
        </div>
      </div>

      <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-2 text-sm font-semibold text-zinc-900">
          {t("community.details")}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          {event.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-zinc-900">
          {t("community.venue")}
        </h2>
        <p className="font-medium text-zinc-900">{event.venue}</p>
        <p className="text-sm text-zinc-500">{event.address}</p>
        <p className="mt-2 text-xs text-zinc-400">
          {t("common.organizedBy")} {event.organizer}
        </p>
      </section>

      {location && (
        <section className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
          <h2 className="mb-1 text-sm font-semibold text-emerald-800">
            {t("community.nearbyRental")}
          </h2>
          <p className="font-medium text-zinc-900">{location.name}</p>
          <p className="mb-3 text-sm text-zinc-600">{location.address}</p>
          <p className="mb-3 text-xs text-emerald-700">
            {t("community.nearbyRentalHint", { hours: location.openHours })}
          </p>
          <Link
            href={`/map?product=${recommended[0]?.id ?? ""}`}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            {t("community.findNearbyRental")}
          </Link>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-1 text-lg font-bold text-zinc-900">
            {t("community.recommendedGear")}
          </h2>
          <p className="mb-4 text-sm text-zinc-500">
            {t("community.recommendedHint")}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommended.map((product) => {
              const total = getStockTotal(
                getAggregatedProductInventory(product.id, locations, products),
              );
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-md"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-1.5"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {product.name}
                    </p>
                    <p className="text-xs font-bold text-emerald-600">
                      ฿{product.pricePerRental}
                      {t("common.perRental")}
                    </p>
                    <StockBadge
                      total={total}
                      unit={product.sizeUnit}
                      size="sm"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
