import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MyRentalsList from "@/components/MyRentalsList";
import { auth } from "@/auth";
import { getTranslator } from "@/lib/i18n/server";
import { getProducts } from "@/lib/products.server";
import { getUserRentalReservations } from "@/lib/rentals";
import { isReservationActive } from "@/lib/rental-status";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.rentalsTitle"),
    description: t("meta.rentalsDescription"),
  };
}

export default async function RentalsPage() {
  const session = await auth();
  const t = await getTranslator();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/rentals")}`);
  }

  const [rentals, products] = await Promise.all([
    getUserRentalReservations(session.user.id),
    getProducts(),
  ]);

  const productsById = Object.fromEntries(products.map((p) => [p.id, p]));
  const activeCount = rentals.filter(isReservationActive).length;

  return (
    <main className="relative flex-1 bg-[#faf9f6] pb-28 lg:pb-16">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-64 h-72 w-72 rounded-full bg-teal-200/15 blur-3xl" />

      <div className="relative overflow-hidden border-b border-zinc-200/50 bg-gradient-to-br from-white via-emerald-50/25 to-[#faf9f6]">
        <div className="home-hero-grid absolute inset-0 opacity-[0.035]" />
        <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Tua Plew
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-[1.08] tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            {t("rental.pageTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
            {t("rental.pageSubtitle")}
          </p>

          {activeCount > 0 && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t("rental.activeCount", { count: activeCount })}
            </p>
          )}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-8 lg:px-10">
        <div className="mt-6 sm:mt-8">
          <MyRentalsList
            initialRentals={rentals}
            productsById={productsById}
          />
        </div>
      </div>
    </main>
  );
}
