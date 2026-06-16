import Link from "next/link";
import type { CommunityEvent } from "@/lib/types";
import { getUpcomingEvents } from "@/lib/community";
import { getTranslator } from "@/lib/i18n/server";
import CommunityCard from "./CommunityCard";

type Props = {
  events: CommunityEvent[];
  enrolledEventIds: string[];
};

const HOME_EVENT_LIMIT = 6;

export default async function HomeCommunitySection({
  events,
  enrolledEventIds,
}: Props) {
  const t = await getTranslator();
  const upcoming = getUpcomingEvents(events).slice(0, HOME_EVENT_LIMIT);

  return (
    <section
      id="events"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-8 sm:px-6 sm:py-10"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            {t("home.eventsEyebrow")}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {t("home.eventsTitle")}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-600">
            {t("home.eventsSubtitle")}
          </p>
        </div>
        <Link
          href="/community"
          className="inline-flex shrink-0 items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
        >
          {t("home.viewAllEvents")} →
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          {t("common.noEventsInCategory")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <CommunityCard
              key={event.id}
              event={event}
              joined={enrolledEventIds.includes(event.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
