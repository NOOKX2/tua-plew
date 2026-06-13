import type { Locale } from "./config";
import { localeTag } from "./config";

export function formatEventDate(date: string, locale: Locale): string {
  return new Date(date).toLocaleDateString(localeTag(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatEventTime(
  start: string,
  end: string | undefined,
  locale: Locale,
  timeSuffix: string,
): string {
  if (end) {
    return locale === "th"
      ? `${start} – ${end} ${timeSuffix}`.trim()
      : `${start} – ${end}`;
  }
  return locale === "th" ? `${start} ${timeSuffix}`.trim() : start;
}

export function formatCampaignPeriod(
  start: string,
  end: string,
  locale: Locale,
): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const startStr = new Date(start).toLocaleDateString(localeTag(locale), opts);
  const endStr = new Date(end).toLocaleDateString(localeTag(locale), opts);
  return `${startStr} – ${endStr}`;
}

export function localizeOpenHours(hours: string, locale: Locale): string {
  if (locale === "en") {
    return hours
      .replace("24 ชม.", "24 hrs")
      .replace("ชม.", "hrs");
  }
  return hours;
}
