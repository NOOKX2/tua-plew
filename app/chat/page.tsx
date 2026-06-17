import { redirect } from "next/navigation";
import ChatInboxList from "@/components/ChatInboxList";
import CommunitySocialNav from "@/components/CommunitySocialNav";
import { auth } from "@/auth";
import { getChatInboxForUser } from "@/lib/chat-inbox";
import { getTranslator } from "@/lib/i18n/server";

export async function generateMetadata() {
  const t = await getTranslator();
  return {
    title: t("meta.chatTitle"),
    description: t("meta.chatDescription"),
  };
}

export default async function ChatInboxPage() {
  const session = await auth();
  const t = await getTranslator();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/chat")}`);
  }

  const items = await getChatInboxForUser(session.user.id);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium text-blue-600">Tua Plew Community</p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          {t("chat.inbox.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{t("chat.inbox.subtitle")}</p>
      </div>

      <CommunitySocialNav />
      <ChatInboxList items={items} />
    </main>
  );
}
