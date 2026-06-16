"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { enrollUserInEvent, unenrollUserFromEvent } from "@/lib/community-enrollments";
import { isEventFull, isEventJoinable } from "@/lib/community";
import { fetchCommunityEventById } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";
import type { ActionResult } from "./types";

export async function joinCommunityEventAction(
  eventId: string,
): Promise<ActionResult<{ participantCount: number }>> {
  const t = await getTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: t("community.errors.loginRequired") };
  }

  const event = await fetchCommunityEventById(eventId);

  if (!event) {
    return { ok: false, error: t("community.errors.notFound") };
  }

  if (!isEventJoinable(event)) {
    return { ok: false, error: t("community.errors.ended") };
  }

  if (isEventFull(event)) {
    return { ok: false, error: t("community.errors.full") };
  }

  try {
    const { participantCount } = await enrollUserInEvent(
      session.user.id,
      eventId,
    );

    revalidatePath("/");
    revalidatePath("/community");
    revalidatePath(`/community/${eventId}`);
    revalidatePath(`/community/${eventId}/welcome`);

    return { ok: true, data: { participantCount } };
  } catch {
    return { ok: false, error: t("community.errors.joinFailed") };
  }
}

export async function leaveCommunityEventAction(
  eventId: string,
): Promise<ActionResult<{ participantCount: number }>> {
  const t = await getTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: t("community.errors.loginRequired") };
  }

  const event = await fetchCommunityEventById(eventId);

  if (!event) {
    return { ok: false, error: t("community.errors.notFound") };
  }

  try {
    const { participantCount } = await unenrollUserFromEvent(
      session.user.id,
      eventId,
    );

    revalidatePath("/");
    revalidatePath("/community");
    revalidatePath(`/community/${eventId}`);
    revalidatePath(`/community/${eventId}/welcome`);

    return { ok: true, data: { participantCount } };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_ENROLLED") {
      return { ok: false, error: t("community.errors.notEnrolled") };
    }
    return { ok: false, error: t("community.errors.leaveFailed") };
  }
}
