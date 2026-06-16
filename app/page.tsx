import HomePage from "@/components/HomePage";
import { auth } from "@/auth";
import { getUserEnrolledEventIds } from "@/lib/community-enrollments";
import { getCommunityEvents } from "@/lib/community.server";
import { getRentalLocations } from "@/lib/locations.server";
import { getProducts } from "@/lib/products.server";

export default async function Home() {
  const session = await auth();
  const [events, locations, products, enrolledEventIds] = await Promise.all([
    getCommunityEvents(),
    getRentalLocations(),
    getProducts(),
    session?.user?.id
      ? getUserEnrolledEventIds(session.user.id)
      : Promise.resolve([] as string[]),
  ]);

  return (
    <HomePage
      events={events}
      enrolledEventIds={enrolledEventIds}
      locations={locations}
      products={products}
    />
  );
}
