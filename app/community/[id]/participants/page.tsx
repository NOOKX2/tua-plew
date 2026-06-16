import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import EventParticipantsPanel from "@/components/EventParticipantsPanel";
import { auth } from "@/auth";
import { getEventParticipants } from "@/lib/community-participants";
import { getCommunityEventByIdAsync } from "@/lib/community.server";
import { getTranslator } from "@/lib/i18n/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const [event, t] = await Promise.all([
    getCommunityEventByIdAsync(id),
    getTranslator(),
  ]);

  if (!event) {
    return { title: t("meta.eventNotFound") };
  }

  return {
    title: `${t("community.participants.pageTitle")} — ${event.title}`,
  };
}

export default async function EventParticipantsPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const t = await getTranslator();

  const [event, participants] = await Promise.all([
    getCommunityEventByIdAsync(id),
    getEventParticipants(id, session?.user?.id ?? undefined),
  ]);

  if (!event) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4">
        <BackButton fallbackHref={`/community/${id}`} />
      </div>

      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
          {t("community.participants.pageTitle")}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
          {event.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {t("community.participants.pageSubtitle", {
            count: event.participantCount,
          })}
          {event.maxParticipants
            ? ` · ${t("community.participants.capacity", { max: event.maxParticipants })}`
            : ""}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <EventParticipantsPanel
          participants={participants}
          currentUserId={session?.user?.id ?? null}
          showSelf
        />
      </div>
    </main>
  );
}
