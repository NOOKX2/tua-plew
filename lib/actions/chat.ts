"use server";

import { auth } from "@/auth";
import {
  getEventChatMessages,
  sendEventChatMessage,
} from "@/lib/event-chat";
import {
  getDirectMessages,
  sendDirectMessage,
  userCanAccessConversation,
} from "@/lib/direct-chat";
import { isUserEnrolledInEvent } from "@/lib/community-enrollments";
import { getTranslator } from "@/lib/i18n/server";
import type { ChatMessage } from "@/lib/types";
import type { ActionResult } from "./types";

export async function getEventChatMessagesAction(
  eventId: string,
): Promise<ActionResult<{ messages: ChatMessage[] }>> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  const enrolled = await isUserEnrolledInEvent(session.user.id, eventId);
  if (!enrolled) {
    return { ok: false, error: t("community.social.errors.notEnrolled") };
  }

  const messages = await getEventChatMessages(eventId);
  return { ok: true, data: { messages } };
}

export async function sendEventChatMessageAction(
  eventId: string,
  body: string,
): Promise<ActionResult<{ message: ChatMessage }>> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  try {
    const message = await sendEventChatMessage(session.user.id, eventId, body);
    return { ok: true, data: { message } };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_ENROLLED") {
        return { ok: false, error: t("community.social.errors.notEnrolled") };
      }
      if (error.message === "EMPTY_MESSAGE") {
        return { ok: false, error: t("community.social.errors.emptyMessage") };
      }
    }
    return { ok: false, error: t("community.social.errors.sendFailed") };
  }
}

export async function getDirectMessagesAction(
  conversationId: string,
): Promise<ActionResult<{ messages: ChatMessage[] }>> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  const allowed = await userCanAccessConversation(
    session.user.id,
    conversationId,
  );
  if (!allowed) {
    return { ok: false, error: t("community.social.errors.notAllowed") };
  }

  const messages = await getDirectMessages(conversationId);
  return { ok: true, data: { messages } };
}

export async function sendDirectMessageAction(
  conversationId: string,
  body: string,
): Promise<ActionResult<{ message: ChatMessage }>> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  try {
    const message = await sendDirectMessage(
      session.user.id,
      conversationId,
      body,
    );
    return { ok: true, data: { message } };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FRIENDS") {
        return { ok: false, error: t("community.social.errors.notFriends") };
      }
      if (error.message === "EMPTY_MESSAGE") {
        return { ok: false, error: t("community.social.errors.emptyMessage") };
      }
    }
    return { ok: false, error: t("community.social.errors.sendFailed") };
  }
}
