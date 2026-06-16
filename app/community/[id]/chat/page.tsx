import { notFound, redirect } from "next/navigation";
import BackButton from "@/components/BackButton";
import EventGroupChat from "@/components/EventGroupChat";
import { auth } from "@/auth";
import { isUserEnrolledInEvent } from "@/lib/community-enrollments";
import { getCommunityEventByIdAsync } from "@/lib/community.server";
import { getEventChatMessages } from "@/lib/event-chat";
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
    title: `${t("community.social.chat.groupTitle")} — ${event.title}`,
  };
}

export default async function EventChatPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const t = await getTranslator();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/community/${id}/chat`)}`);
  }

  const [event, enrolled] = await Promise.all([
    getCommunityEventByIdAsync(id),
    isUserEnrolledInEvent(session.user.id, id),
  ]);

  if (!event) notFound();
  if (!enrolled) {
    redirect(`/community/${id}`);
  }

  const messages = await getEventChatMessages(id);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4">
        <BackButton fallbackHref="/chat" />
      </div>

      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
          {t("community.social.chat.groupTitle")}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
          {event.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {t("community.social.chat.groupSubtitle")}
        </p>
        <p className="mt-2 text-xs font-medium text-emerald-700">
          {t("community.social.chat.memberCount", {
            count: event.participantCount,
          })}
        </p>
      </div>

      <div className="min-h-[calc(100dvh-14rem)]">
        <EventGroupChat
          eventId={id}
          currentUserId={session.user.id}
          initialMessages={messages}
        />
      </div>
    </main>
  );
}
