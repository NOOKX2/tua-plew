import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommunityDetail from "@/components/CommunityDetail";
import {
  communityEvents,
  getCommunityEventById,
} from "@/lib/community";
import { rentalLocations } from "@/lib/locations";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return communityEvents.map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = getCommunityEventById(id);

  if (!event) {
    return { title: "ไม่พบกิจกรรม | Fit-to-Go" };
  }

  return {
    title: `${event.title} | Fit-to-Go Community`,
    description: event.shortDescription,
  };
}

export default async function CommunityEventPage({ params }: Props) {
  const { id } = await params;
  const event = getCommunityEventById(id);

  if (!event) {
    notFound();
  }

  const location = rentalLocations.find((loc) => loc.id === event.locationId);

  return (
    <CommunityDetail
      event={event}
      location={location}
      locations={rentalLocations}
    />
  );
}
