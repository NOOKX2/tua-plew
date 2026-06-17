import type { Metadata } from "next";
import CommunityPageIntro from "@/components/CommunityPageIntro";
import CommunityList from "@/components/CommunityList";
import CommunitySocialNav from "@/components/CommunitySocialNav";
import { getCommunityEvents } from "@/lib/community.server";
import { getLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = createTranslator(locale);
  return {
    title: t("meta.communityTitle"),
    description: t("meta.communityDescription"),
  };
}

export default async function CommunityPage() {
  const events = await getCommunityEvents();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <CommunityPageIntro />
      <CommunitySocialNav />
      <CommunityList events={events} />
    </main>
  );
}
