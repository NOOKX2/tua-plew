import type { Metadata } from "next";
import CommunityList from "@/components/CommunityList";
import { getCommunityEvents } from "@/lib/community.server";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.communityTitle"),
    description: t("meta.communityDescription"),
  };
}

export default async function CommunityPage() {
  const [events, t] = await Promise.all([
    getCommunityEvents(),
    getTranslator(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-emerald-600">
          Tua Plew Community
        </p>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
          {t("community.title")}
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500 sm:text-base">
          {t("community.subtitle")}
        </p>
      </div>

      <CommunityList events={events} />
    </main>
  );
}
