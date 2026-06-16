"use client";

import { useCallback, useState, useTransition } from "react";
import type { ChatMessage } from "@/lib/types";
import {
  getEventChatMessagesAction,
  sendEventChatMessageAction,
} from "@/lib/actions/chat";
import { useTranslations } from "@/lib/i18n/client";
import ChatPanel from "./ChatPanel";

type Props = {
  eventId: string;
  currentUserId: string;
  initialMessages: ChatMessage[];
};

export default function EventGroupChat({
  eventId,
  currentUserId,
  initialMessages,
}: Props) {
  const t = useTranslations();
  const [messages, setMessages] = useState(initialMessages);
  const [, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    const result = await getEventChatMessagesAction(eventId);
    if (result.ok) {
      startTransition(() => setMessages(result.data.messages));
    }
  }, [eventId, startTransition]);

  async function handleSend(body: string) {
    const result = await sendEventChatMessageAction(eventId, body);
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
      placeholder={t("community.social.chat.groupPlaceholder")}
    />
  );
}
