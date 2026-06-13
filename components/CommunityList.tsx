"use client";

import { useMemo, useState } from "react";
import type { CommunityActivityType, CommunityEvent } from "@/lib/types";
import {
  ACTIVITY_LABELS,
  getUpcomingEvents,
} from "@/lib/community";
import CommunityCard from "./CommunityCard";

type Props = {
  events: CommunityEvent[];
};

const ALL = "all" as const;
type Filter = typeof ALL | CommunityActivityType;

export default function CommunityList({ events }: Props) {
  const [filter, setFilter] = useState<Filter>(ALL);

  const activityTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.activityType));
    return [...types];
  }, [events]);

  const filtered = useMemo(() => {
    const upcoming = getUpcomingEvents(events);
    if (filter === ALL) return upcoming;
    return upcoming.filter((e) => e.activityType === filter);
  }, [events, filter]);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterButton
          active={filter === ALL}
          onClick={() => setFilter(ALL)}
          label="ทั้งหมด"
        />
        {activityTypes.map((type) => (
          <FilterButton
            key={type}
            active={filter === type}
            onClick={() => setFilter(type)}
            label={ACTIVITY_LABELS[type]}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          ยังไม่มีกิจกรรมในหมวดนี้
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <CommunityCard key={event.id} event={event} />
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
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${active
          ? "bg-emerald-600 text-white"
          : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
        }`}
    >
      {label}
    </button>
  );
}
