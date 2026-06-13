import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommunityDetail from "@/components/CommunityDetail";
import {
  getCommunityEventByIdAsync,
  getCommunityEventIds,
} from "@/lib/community";
import { getRentalLocations } from "@/lib/locations";
import { getProducts } from "@/lib/products";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getCommunityEventIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getCommunityEventByIdAsync(id);

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
