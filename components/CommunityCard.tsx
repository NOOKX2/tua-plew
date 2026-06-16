"use client";

import Image from "next/image";
import Link from "next/link";
import type { CommunityEvent } from "@/lib/types";
import { ACTIVITY_EMOJI, spotsLeft } from "@/lib/community";
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

type Props = {
  event: CommunityEvent;
  compact?: boolean;
  joined?: boolean;
};

export default function CommunityCard({ event, compact = false, joined = false }: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const remaining = spotsLeft(event);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-emerald-300 hover:shadow-md">
      <Link
        href={`/community/${event.id}`}
        className="group flex flex-1 flex-col"
      >
        <div
          className={`relative aspect-[16/10] w-full overflow-hidden ${compact ? "aspect-[2/1]" : ""}`}
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
          {joined && (
            <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              ✓ {t("community.joined")}
            </span>
          )}
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
                {getActivityLabel(event.activityType, locale, messages)}
              </span>
              <span className="text-2xl drop-shadow-sm" aria-hidden>
                {ACTIVITY_EMOJI[event.activityType]}
              </span>
            </div>
            <h3 className="text-lg font-bold leading-snug drop-shadow-sm group-hover:underline">
              {event.title}
            </h3>
            {!compact && (
              <p className="mt-1 line-clamp-2 text-sm text-white/90">
                {event.shortDescription}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex flex-wrap gap-2 text-xs text-zinc-600">
            <span className="rounded-md bg-zinc-100 px-2 py-1">
              📅 {formatEventDate(event.date, locale)}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-1">
              🕐{" "}
              {formatEventTime(
                event.startTime,
                event.endTime,
                locale,
                t("community.timeSuffix"),
              )}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-1">
              {getDifficultyLabel(event.difficulty, locale, messages)}
            </span>
          </div>

          <p className="mb-3 line-clamp-1 text-sm text-zinc-500">{event.venue}</p>

          <div className="mt-auto flex items-center justify-between gap-2">
            <p className="text-xs text-zinc-500">
              👥 {event.participantCount}
              {event.maxParticipants ? ` / ${event.maxParticipants}` : ""}{" "}
              {t("common.people")}
              {remaining !== null && remaining <= 10 && (
                <span className="ml-1 font-medium text-amber-600">
                  {t("common.spotsLeftShort", { count: remaining })}
                </span>
              )}
            </p>
            <span className="text-xs font-medium text-emerald-600">
              {t("common.viewDetails")}
            </span>
          </div>
        </div>
      </Link>

      <div className="border-t border-zinc-100 px-4 py-3">
        <CommunityJoinButton
          event={event}
          initialJoined={joined}
          compact
          showGroupChat={joined}
          callbackUrl={`/community/${event.id}`}
        />
      </div>
    </div>
  );
}
