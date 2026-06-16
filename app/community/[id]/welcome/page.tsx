import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CommunityJoinWelcome from "@/components/CommunityJoinWelcome";
import { auth } from "@/auth";
import { isUserEnrolledInEvent } from "@/lib/community-enrollments";
import { getCommunityEventByIdAsync } from "@/lib/community.server";
import { getLocalizedEventJoinPerks } from "@/lib/event-perks.server";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import { getRentalLocations } from "@/lib/locations.server";
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
    title: t("community.joinWelcome.metaTitle", { event: event.title }),
    description: t("community.joinWelcome.metaDescription"),
  };
}

export default async function CommunityJoinWelcomePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/community/${id}/welcome`)}`,
    );
  }

  const [event, locations, products, joined, locale] = await Promise.all([
    getCommunityEventByIdAsync(id),
    getRentalLocations(),
    getProducts(),
    isUserEnrolledInEvent(session.user.id, id),
    getLocale(),
  ]);

  if (!event) {
    notFound();
  }

  if (!joined) {
    redirect(`/community/${id}`);
  }

  const perks = getLocalizedEventJoinPerks(id, locale);
  const location = locations.find((loc) => loc.id === event.locationId);

  return (
    <CommunityJoinWelcome
      event={event}
      perks={perks}
      location={location}
      locations={locations}
      products={products}
      locale={locale}
    />
  );
}
