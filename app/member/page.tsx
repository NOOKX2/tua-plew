import type { Metadata } from "next";
import { Suspense } from "react";
import MemberPageContent from "@/components/MemberPageContent";
import MemberTopUpSuccessBanner from "@/components/MemberTopUpSuccessBanner";
import { auth } from "@/auth";
import { getActiveRentalCountForSession } from "@/lib/rentals.server";
import { getRentalTokenBalanceForSession } from "@/lib/rental-tokens.server";
import { getTranslator } from "@/lib/i18n/server";
import { isAdminUser } from "@/lib/user-role.server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.memberTitle"),
    description: t("meta.memberDescription"),
  };
}

export default async function MemberPage() {
  const [session, t, activeRentals, tokenBalance] = await Promise.all([
    auth(),
    getTranslator(),
    getActiveRentalCountForSession(),
    getRentalTokenBalanceForSession(),
  ]);

  const user = session?.user?.id
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  const showAdmin =
    user &&
    (session?.user?.role === "admin" ||
      (await isAdminUser(user.id, user.email)));

  return (
    <main className="relative flex-1 overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-blue-50/80 to-transparent" />

      <div className="relative mx-auto w-full max-w-md flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600/90">
            Tua Plew
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            {t("member.title")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            {t("member.subtitle")}
          </p>
        </div>

        <Suspense fallback={null}>
          <MemberTopUpSuccessBanner />
        </Suspense>

        <MemberPageContent
          user={user}
          activeRentals={activeRentals}
          showAdmin={Boolean(showAdmin)}
          tokenBalance={tokenBalance}
        />
      </div>
    </main>
  );
}
