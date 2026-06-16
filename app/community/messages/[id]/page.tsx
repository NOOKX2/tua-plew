import { notFound, redirect } from "next/navigation";
import BackButton from "@/components/BackButton";
import DirectChatThread from "@/components/DirectChatThread";
import { UserAvatar } from "@/components/CommunitySocialNav";
import { auth } from "@/auth";
import {
  getDirectConversations,
  getDirectMessages,
  userCanAccessConversation,
} from "@/lib/direct-chat";
import { getTranslator } from "@/lib/i18n/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DirectMessagePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const t = await getTranslator();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/community/messages/${id}`)}`);
  }

  const allowed = await userCanAccessConversation(session.user.id, id);
  if (!allowed) notFound();

  const [messages, conversations] = await Promise.all([
    getDirectMessages(id),
    getDirectConversations(session.user.id),
  ]);

  const conversation = conversations.find((item) => item.id === id);
  if (!conversation) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4">
        <BackButton fallbackHref="/chat" />
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <UserAvatar
          name={conversation.otherUser.name}
          image={conversation.otherUser.image}
        />
        <div>
          <h1 className="text-lg font-bold text-zinc-900">
            {conversation.otherUser.name}
          </h1>
          <p className="text-sm text-zinc-500">
            {t("community.social.messages.directChat")}
          </p>
        </div>
      </div>

      <DirectChatThread
        conversationId={id}
        currentUserId={session.user.id}
        initialMessages={messages}
      />
    </main>
  );
}
