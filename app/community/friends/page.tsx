import Link from "next/link";
import { redirect } from "next/navigation";
import CommunitySocialNav from "@/components/CommunitySocialNav";
import FriendsPanel from "@/components/FriendsPanel";
import { auth } from "@/auth";
import { getFriendshipViews } from "@/lib/friendships";
import { getTranslator } from "@/lib/i18n/server";

export async function generateMetadata() {
  const t = await getTranslator();
  return {
    title: `${t("community.social.nav.friends")} | Tua Plew`,
  };
}

export default async function CommunityFriendsPage() {
  const session = await auth();
  const t = await getTranslator();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/community/friends")}`);
  }

  const friendships = await getFriendshipViews(session.user.id);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium text-blue-600">
          Tua Plew Community
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          {t("community.social.nav.friends")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {t("community.social.friends.subtitle")}
        </p>
      </div>

      <CommunitySocialNav />
      <FriendsPanel friendships={friendships} />
    </main>
  );
}
