import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommunityDetail from "@/components/CommunityDetail";
import { auth } from "@/auth";
import { isUserEnrolledInEvent } from "@/lib/community-enrollments";
import { getEventParticipants } from "@/lib/community-participants";
import {
  getCommunityEventByIdAsync,
} from "@/lib/community.server";
import { getRentalLocations } from "@/lib/locations.server";
import { getTranslator } from "@/lib/i18n/server";
import { getProducts } from "@/lib/products.server";
import { getCommunityEventIds } from "@/lib/community.server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getCommunityEventIds();
  return ids.map((id) => ({ id }));
}

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
  const session = await auth();
  const [event, locations, products, joined, participants] = await Promise.all([
    getCommunityEventByIdAsync(id),
    getRentalLocations(),
    getProducts(),
    session?.user?.id
      ? isUserEnrolledInEvent(session.user.id, id)
      : Promise.resolve(false),
    getEventParticipants(id, session?.user?.id ?? undefined),
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
      joined={joined}
      participants={participants}
      currentUserId={session?.user?.id ?? null}
    />
  );
}
