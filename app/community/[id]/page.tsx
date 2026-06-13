import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommunityDetail from "@/components/CommunityDetail";
import {
  getCommunityEventByIdAsync,
} from "@/lib/community.server";
import { getRentalLocations } from "@/lib/locations.server";
import { getTranslator } from "@/lib/i18n/server";
import { getProducts } from "@/lib/products.server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [event, t] = await Promise.all([
    getCommunityEventByIdAsync(id),
    getTranslator(),
  ]);

  if (!event) {
    return { title: t("meta.eventNotFound") };
  }

  return {
    title: `${event.title} | Tua Plew Community`,
    description: event.shortDescription,
  };
}

export default async function CommunityEventPage({ params }: Props) {
  const { id } = await params;
  const [event, locations, products] = await Promise.all([
    getCommunityEventByIdAsync(id),
    getRentalLocations(),
    getProducts(),
  ]);

  if (!event) {
    notFound();
  }

  const location = locations.find((loc) => loc.id === event.locationId);

  return (
    <CommunityDetail
      event={event}
      location={location}
      locations={locations}
      products={products}
    />
  );
}
