import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommunityDetail from "@/components/CommunityDetail";
import { getEventParticipants } from "@/lib/community-participants";
import {
  getCommunityEventByIdAsync,
  getCommunityEventIds,
} from "@/lib/community.server";
import { staticT } from "@/lib/i18n/static";
import { getRentalLocations } from "@/lib/locations.server";
import { getProducts } from "@/lib/products.server";

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const ids = await getCommunityEventIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getCommunityEventByIdAsync(id);

  if (!event) {
    return { title: staticT("meta.eventNotFound") };
  }

  return {
    title: `${event.title} | Tua Plew Community`,
    description: event.shortDescription,
  };
}

export default async function CommunityEventPage({ params }: Props) {
  const { id } = await params;
  const [event, locations, products, participants] = await Promise.all([
    getCommunityEventByIdAsync(id),
    getRentalLocations(),
    getProducts(),
    getEventParticipants(id),
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
      participants={participants}
    />
  );
}
