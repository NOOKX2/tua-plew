import Link from "next/link";
import type { CommunityEvent } from "@/lib/types";
import {
  ACTIVITY_EMOJI,
  ACTIVITY_GRADIENT,
  ACTIVITY_LABELS,
  DIFFICULTY_LABELS,
  formatEventDate,
  formatEventTime,
  spotsLeft,
} from "@/lib/community";

type Props = {
  event: CommunityEvent;
  compact?: boolean;
};

export default function CommunityCard({ event, compact = false }: Props) {
  const remaining = spotsLeft(event);

  return (
    <Link
      href={`/community/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-emerald-300 hover:shadow-md"
    >
      <div
        className={`relative bg-gradient-to-br ${ACTIVITY_GRADIENT[event.activityType]} px-4 py-5 text-white ${compact ? "py-4" : ""}`}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
            {ACTIVITY_LABELS[event.activityType]}
          </span>
          <span className="text-2xl" aria-hidden>
            {ACTIVITY_EMOJI[event.activityType]}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug group-hover:underline">
          {event.title}
        </h3>
        {!compact && (
          <p className="mt-1 line-clamp-2 text-sm text-white/85">
            {event.shortDescription}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-zinc-600">
          <span className="rounded-md bg-zinc-100 px-2 py-1">
            📅 {formatEventDate(event.date)}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-1">
            🕐 {formatEventTime(event.startTime, event.endTime)}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-1">
            {DIFFICULTY_LABELS[event.difficulty]}
          </span>
        </div>

        <p className="mb-3 line-clamp-1 text-sm text-zinc-500">{event.venue}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-xs text-zinc-500">
            👥 {event.participantCount}
            {event.maxParticipants ? ` / ${event.maxParticipants}` : ""} คน
            {remaining !== null && remaining <= 10 && (
              <span className="ml-1 font-medium text-amber-600">
                เหลือ {remaining} ที่
              </span>
            )}
          </p>
          <span className="text-xs font-medium text-emerald-600">
            ดูรายละเอียด →
          </span>
        </div>
      </div>
    </Link>
  );
}
