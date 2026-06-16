import "server-only";

import type { EventJoinPerk } from "./types";
import type { Locale } from "./i18n/config";
import { getEventJoinPerks } from "./event-perks";
import { eventPerksEn } from "./i18n/event-perks-en";

export function getLocalizedEventJoinPerks(
  eventId: string,
  locale: Locale,
): EventJoinPerk[] {
  const perks = getEventJoinPerks(eventId);

  if (locale === "th") {
    return perks;
  }

  return perks.map((perk) => {
    const en = eventPerksEn[perk.id as keyof typeof eventPerksEn];
    if (!en) return perk;
    return { ...perk, ...en };
  });
}
