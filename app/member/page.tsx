import type { Metadata } from "next";
import MemberPageContent from "@/components/MemberPageContent";
import { auth } from "@/auth";
import { getTranslator } from "@/lib/i18n/server";
import { getActiveRentalCountForSession } from "@/lib/rentals.server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.memberTitle"),
    description: t("meta.memberDescription"),
  };
}

export default async function MemberPage() {
  const [session, t, activeRentals] = await Promise.all([
    auth(),
    getTranslator(),
    getActiveRentalCountForSession(),
  ]);

  const user = session?.user?.id
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
          Tua Plew
        </p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
          {t("member.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{t("member.subtitle")}</p>
      </div>

      <MemberPageContent user={user} activeRentals={activeRentals} />
    </main>
  );
}
