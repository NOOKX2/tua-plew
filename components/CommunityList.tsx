"use client";

import { useMemo, useState } from "react";
import type { CommunityActivityType, CommunityEvent } from "@/lib/types";
import { getUpcomingEvents } from "@/lib/community";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getActivityLabel } from "@/lib/i18n/labels";
import CommunityCard from "./CommunityCard";
import FilterMenu from "./FilterMenu";
import { useUser } from "./UserProvider";

type Props = {
  events: CommunityEvent[];
  enrolledEventIds?: string[];
  isAuthenticated?: boolean;
};

const ALL = "all" as const;
type Filter = typeof ALL | CommunityActivityType;

export default function CommunityList({
  events,
  enrolledEventIds: enrolledEventIdsProp,
  isAuthenticated: isAuthenticatedProp,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const {
    enrolledEventIds: enrolledFromUser,
    isAuthenticated: isAuthenticatedFromUser,
  } = useUser();
  const enrolledEventIds = enrolledEventIdsProp ?? enrolledFromUser;
  const isAuthenticated = isAuthenticatedProp ?? isAuthenticatedFromUser;
  const [filter, setFilter] = useState<Filter>(ALL);

  const activityTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.activityType));
    return [...types];
  }, [events]);

  const filterOptions = useMemo(
    () => [
      { id: ALL, label: t("common.all") },
      ...activityTypes.map((type) => ({
        id: type,
        label: getActivityLabel(type, locale, messages),
      })),
    ],
    [activityTypes, locale, messages, t],
  );

  const filtered = useMemo(() => {
    const upcoming = getUpcomingEvents(events);
    if (filter === ALL) return upcoming;
    return upcoming.filter((e) => e.activityType === filter);
  }, [events, filter]);

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
          {t("common.noEventsInCategory")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <CommunityCard
              key={event.id}
              event={event}
              joined={enrolledEventIds.includes(event.id)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </>
  );
}
