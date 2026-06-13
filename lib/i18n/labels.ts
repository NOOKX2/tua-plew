import type { Locale } from "./config";
import type { Messages } from "./translate";
import type {
  CampaignType,
  CommunityActivityType,
  CommunityEvent,
  ProductCategory,
  RentalLocation,
  SizeUnit,
} from "../types";

export function getCategoryLabel(
  category: ProductCategory,
  locale: Locale,
  messages: Messages,
): string {
  return messages.categories[category];
}

export function getActivityLabel(
  type: CommunityActivityType,
  locale: Locale,
  messages: Messages,
): string {
  return messages.activities[type];
}

export function getDifficultyLabel(
  difficulty: CommunityEvent["difficulty"],
  locale: Locale,
  messages: Messages,
): string {
  return messages.difficulty[difficulty];
}

export function getCampaignTypeLabel(
  type: CampaignType,
  locale: Locale,
  messages: Messages,
): string {
  return messages.campaignTypes[type];
}

export function getLocationTypeLabel(
  type: RentalLocation["type"],
  locale: Locale,
  messages: Messages,
): string {
  return messages.locationTypes[type];
}

export function getSizeUnitLabel(
  unit: SizeUnit,
  locale: Locale,
  messages: Messages,
): string {
  return unit === "คู่" ? messages.units.pair : messages.units.piece;
}

export function formatDiscount(
  percent: number,
  locale: Locale,
  messages: Messages,
): string {
  return messages.campaign.discountLabel.replace("{percent}", String(percent));
}
