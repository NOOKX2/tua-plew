"use client";

import { useMemo } from "react";
import type {
  Campaign,
  CommunityEvent,
  Product,
  RentalLocation,
} from "@/lib/types";
import { useLocale } from "./client";
import {
  localizeCampaign,
  localizeCommunityEvent,
  localizeLocation,
  localizeProduct,
} from "./localize-catalog";

export function useLocalizedEvent(event: CommunityEvent) {
  const { locale } = useLocale();
  return useMemo(
    () => localizeCommunityEvent(event, locale),
    [event, locale],
  );
}

export function useLocalizedEvents(events: CommunityEvent[]) {
  const { locale } = useLocale();
  return useMemo(
    () => events.map((event) => localizeCommunityEvent(event, locale)),
    [events, locale],
  );
}

export function useLocalizedCampaign(campaign: Campaign) {
  const { locale } = useLocale();
  return useMemo(
    () => localizeCampaign(campaign, locale),
    [campaign, locale],
  );
}

export function useLocalizedCampaigns(campaigns: Campaign[]) {
  const { locale } = useLocale();
  return useMemo(
    () => campaigns.map((campaign) => localizeCampaign(campaign, locale)),
    [campaigns, locale],
  );
}

export function useLocalizedProduct(product: Product) {
  const { locale } = useLocale();
  return useMemo(
    () => localizeProduct(product, locale),
    [product, locale],
  );
}

export function useLocalizedProducts(products: Product[]) {
  const { locale } = useLocale();
  return useMemo(
    () => products.map((product) => localizeProduct(product, locale)),
    [products, locale],
  );
}

export function useLocalizedLocation(location: RentalLocation) {
  const { locale } = useLocale();
  return useMemo(
    () => localizeLocation(location, locale),
    [location, locale],
  );
}

export function useLocalizedLocations(locations: RentalLocation[]) {
  const { locale } = useLocale();
  return useMemo(
    () => locations.map((location) => localizeLocation(location, locale)),
    [locations, locale],
  );
}
