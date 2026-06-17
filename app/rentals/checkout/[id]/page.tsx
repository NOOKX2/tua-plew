import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import RentalCheckoutView from "@/components/RentalCheckoutView";
import { auth } from "@/auth";
import {
  getRentalCheckoutPeers,
  getRentalReservationForUser,
} from "@/lib/rental-checkout";
import { getLocale, getTranslator } from "@/lib/i18n/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslator();
  return {
    title: `${t("rental.checkout.title")} — ${id.slice(-6).toUpperCase()}`,
    description: t("rental.checkout.description"),
  };
}

export default async function RentalCheckoutPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/rentals/checkout/${id}`)}`);
  }

  const rental = await getRentalReservationForUser(id, session.user.id);
  if (!rental) notFound();

  const peers = await getRentalCheckoutPeers(
    rental.productId,
    rental.locationId,
  );

  return (
    <main className="relative flex-1 bg-[#faf9f6] pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-blue-50/80 to-transparent" />
      <div className="relative mx-auto w-full max-w-lg px-4 py-6 sm:px-6 sm:py-8">
        <RentalCheckoutView
          rental={rental}
          peers={peers}
          currentUserId={session.user.id}
          locale={locale}
        />
      </div>
    </main>
  );
}
