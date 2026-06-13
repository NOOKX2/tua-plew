import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  enrollUserInEvent,
  isUserEnrolledInEvent,
} from "@/lib/community-enrollments";
import { isEventFull, isEventJoinable } from "@/lib/community";
import { fetchCommunityEventById } from "@/lib/data";
import { getTranslatorFromRequest } from "@/lib/i18n/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const t = getTranslatorFromRequest(_request);
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: t("community.errors.loginRequired") },
      { status: 401 },
    );
  }

  const { id } = await params;
  const event = await fetchCommunityEventById(id);

  if (!event) {
    return NextResponse.json(
      { error: t("community.errors.notFound") },
      { status: 404 },
    );
  }

  if (!isEventJoinable(event)) {
    return NextResponse.json(
      { error: t("community.errors.ended") },
      { status: 400 },
    );
  }

  if (isEventFull(event)) {
    return NextResponse.json(
      { error: t("community.errors.full") },
      { status: 400 },
    );
  }

  try {
    const { joinedAt, participantCount } = await enrollUserInEvent(
      session.user.id,
      id,
    );

    return NextResponse.json({
      joined: true,
      joinedAt: joinedAt.toISOString(),
      participantCount,
    });
  } catch {
    return NextResponse.json(
      { error: t("community.errors.joinFailed") },
      { status: 500 },
    );
  }
}
