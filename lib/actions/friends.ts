"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendshipViews,
  removeFriend,
  sendFriendRequest,
} from "@/lib/friendships";
import { findUserByEmail } from "@/lib/users.server";
import { getTranslator } from "@/lib/i18n/server";
import type { FriendshipView } from "@/lib/types";
import type { ActionResult } from "./types";

export async function getFriendshipsAction(): Promise<
  ActionResult<{ friendships: FriendshipView[] }>
> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  const friendships = await getFriendshipViews(session.user.id);
  return { ok: true, data: { friendships } };
}

export async function sendFriendRequestByEmailAction(
  email: string,
): Promise<ActionResult<{ friendship: FriendshipView }>> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return { ok: false, error: t("community.social.errors.userNotFound") };
  }

  try {
    const friendship = await sendFriendRequest(session.user.id, user.id);
    revalidatePath("/community/friends");
    return { ok: true, data: { friendship } };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SELF_REQUEST") {
        return { ok: false, error: t("community.social.errors.selfRequest") };
      }
      if (error.message === "ALREADY_FRIENDS") {
        return { ok: false, error: t("community.social.errors.alreadyFriends") };
      }
      if (error.message === "REQUEST_EXISTS") {
        return { ok: false, error: t("community.social.errors.requestExists") };
      }
    }
    return { ok: false, error: t("community.social.errors.requestFailed") };
  }
}

export async function sendFriendRequestToUserAction(
  userId: string,
): Promise<ActionResult<{ friendship: FriendshipView }>> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  try {
    const friendship = await sendFriendRequest(session.user.id, userId);
    revalidatePath("/community/friends");
    revalidatePath(`/community`);
    return { ok: true, data: { friendship } };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SELF_REQUEST") {
        return { ok: false, error: t("community.social.errors.selfRequest") };
      }
      if (error.message === "ALREADY_FRIENDS") {
        return { ok: false, error: t("community.social.errors.alreadyFriends") };
      }
      if (error.message === "REQUEST_EXISTS") {
        return { ok: false, error: t("community.social.errors.requestExists") };
      }
    }
    return { ok: false, error: t("community.social.errors.requestFailed") };
  }
}

export async function acceptFriendRequestAction(
  friendshipId: string,
): Promise<ActionResult> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  try {
    await acceptFriendRequest(session.user.id, friendshipId);
    revalidatePath("/community/friends");
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: t("community.social.errors.requestFailed") };
  }
}

export async function declineFriendRequestAction(
  friendshipId: string,
): Promise<ActionResult> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  try {
    await declineFriendRequest(session.user.id, friendshipId);
    revalidatePath("/community/friends");
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: t("community.social.errors.requestFailed") };
  }
}

export async function removeFriendAction(
  friendshipId: string,
): Promise<ActionResult> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  try {
    await removeFriend(session.user.id, friendshipId);
    revalidatePath("/community/friends");
    revalidatePath("/community/messages");
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: t("community.social.errors.requestFailed") };
  }
}

export async function startDirectChatAction(
  friendUserId: string,
): Promise<ActionResult<{ conversationId: string }>> {
  const t = await getTranslator();
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: t("community.social.errors.loginRequired") };
  }

  try {
    const { getOrCreateDirectConversation } = await import("@/lib/direct-chat");
    const conversationId = await getOrCreateDirectConversation(
      session.user.id,
      friendUserId,
    );
    return { ok: true, data: { conversationId } };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FRIENDS") {
      return { ok: false, error: t("community.social.errors.notFriends") };
    }
    return { ok: false, error: t("community.social.errors.chatFailed") };
  }
}
