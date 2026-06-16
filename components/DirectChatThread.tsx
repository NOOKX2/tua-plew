"use client";

import { useCallback, useState, useTransition } from "react";
import type { ChatMessage } from "@/lib/types";
import {
  getDirectMessagesAction,
  sendDirectMessageAction,
} from "@/lib/actions/chat";
import { useTranslations } from "@/lib/i18n/client";
import ChatPanel from "./ChatPanel";

type Props = {
  conversationId: string;
  currentUserId: string;
  initialMessages: ChatMessage[];
};

export default function DirectChatThread({
  conversationId,
  currentUserId,
  initialMessages,
}: Props) {
  const t = useTranslations();
  const [messages, setMessages] = useState(initialMessages);
  const [, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    const result = await getDirectMessagesAction(conversationId);
    if (result.ok) {
      startTransition(() => setMessages(result.data.messages));
    }
  }, [conversationId, startTransition]);

  async function handleSend(body: string) {
    const result = await sendDirectMessageAction(conversationId, body);
    if (!result.ok) return { ok: false, error: result.error };
    setMessages((current) => [...current, result.data.message]);
    return { ok: true };
  }

  return (
    <ChatPanel
      messages={messages}
      currentUserId={currentUserId}
      onSend={handleSend}
      onRefresh={refresh}
      placeholder={t("community.social.chat.dmPlaceholder")}
    />
  );
}
