"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CommunityActivityType, CommunityEvent } from "@/lib/types";
import { getUpcomingEvents } from "@/lib/community";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getActivityLabel } from "@/lib/i18n/labels";
import CommunityCard from "./CommunityCard";

type Props = {
  events: CommunityEvent[];
  enrolledEventIds?: string[];
};

const ALL = "all" as const;
type Filter = typeof ALL | CommunityActivityType;

export default function CommunityList({
  events,
  enrolledEventIds = [],
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
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
      <ActivityFilterMenu
        value={filter}
        options={filterOptions}
        onChange={setFilter}
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
            />
          ))}
        </div>
      )}
    </>
  );
}

function ActivityFilterMenu({
  value,
  options,
  onChange,
}: {
  value: Filter;
  options: { id: Filter; label: string }[];
  onChange: (value: Filter) => void;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeLabel =
    options.find((option) => option.id === value)?.label ?? t("common.all");
  const isFiltered = value !== ALL;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative mb-6 flex justify-start">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("common.filterBy")}
        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
          isFiltered
            ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
            : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
        }`}
      >
        <FilterIcon className="size-4 shrink-0" />
        <span>{isFiltered ? activeLabel : t("common.filter")}</span>
        <ChevronIcon
          className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("common.filterBy")}
          className="absolute left-0 top-full z-20 mt-2 max-h-[min(20rem,60dvh)] min-w-[12.5rem] overflow-y-auto rounded-2xl border border-zinc-200 bg-white py-1 shadow-xl shadow-zinc-900/10"
        >
          {options.map((option) => {
            const selected = value === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  selected
                    ? "bg-blue-50 font-semibold text-blue-800"
                    : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <span>{option.label}</span>
                {selected ? <CheckIcon className="size-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.5 4.5h15M5.5 10h9M8.5 15.5h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="m5.5 10.25 3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
