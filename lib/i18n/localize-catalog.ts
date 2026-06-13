import type { Locale } from "./config";
import { catalogEn } from "./catalog-en";
import { localizeOpenHours } from "./format";
import type {
  Campaign,
  CommunityEvent,
  Product,
  RentalLocation,
} from "../types";

export function localizeProduct(product: Product, locale: Locale): Product {
  if (locale === "th") return product;
  const en = catalogEn.products[product.id as keyof typeof catalogEn.products];
  if (!en) return product;
  return { ...product, ...en };
}

export function localizeLocation(
  location: RentalLocation,
  locale: Locale,
): RentalLocation {
  if (locale === "th") return location;
  const en =
    catalogEn.locations[location.id as keyof typeof catalogEn.locations];
  if (!en) return location;
  return {
    ...location,
    ...en,
    openHours: en.openHours
      ? localizeOpenHours(en.openHours, locale)
      : localizeOpenHours(location.openHours, locale),
  };
}

export function localizeCommunityEvent(
  event: CommunityEvent,
  locale: Locale,
): CommunityEvent {
  if (locale === "th") return event;
  const en = catalogEn.events[event.id as keyof typeof catalogEn.events];
  if (!en) return event;
  return { ...event, ...en };
}

export function localizeCampaign(
  campaign: Campaign,
  locale: Locale,
): Campaign {
  if (locale === "th") return campaign;
  const en =
    catalogEn.campaigns[campaign.id as keyof typeof catalogEn.campaigns];
  if (!en) return campaign;
  return { ...campaign, ...en };
}
