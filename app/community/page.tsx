import type { Metadata } from "next";
import CommunityList from "@/components/CommunityList";
import CommunitySocialNav from "@/components/CommunitySocialNav";
import { CATALOG_PAGE_REVALIDATE } from "@/lib/catalog-revalidate";
import { getCommunityEvents } from "@/lib/community.server";
import { staticT } from "@/lib/i18n/static";

export const revalidate = CATALOG_PAGE_REVALIDATE;

export const metadata: Metadata = {
  title: staticT("meta.communityTitle"),
  description: staticT("meta.communityDescription"),
};

export default async function CommunityPage() {
  const events = await getCommunityEvents();
  const t = staticT;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-blue-600">
          Tua Plew Community
        </p>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
          {t("community.title")}
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500 sm:text-base">
          {t("community.subtitle")}
        </p>
      </div>

      <CommunitySocialNav />

      <CommunityList events={events} />
    </main>
  );
}
