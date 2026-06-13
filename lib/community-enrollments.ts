import "server-only";

import { connectDB } from "./mongoose";
import { CommunityEnrollment, CommunityEvent as CommunityEventModel } from "./models";
import { isEventFull, isEventJoinable } from "./community";
import type { CommunityEvent } from "./types";

export async function enrollUserInEvent(
  userId: string,
  eventId: string,
): Promise<{ joinedAt: Date; participantCount: number }> {
  await connectDB();

  const existing = await CommunityEnrollment.findOne({ userId, eventId }).lean();
  if (existing) {
    const event = await CommunityEventModel.findById(eventId).lean();
    return {
      joinedAt: existing.joinedAt as Date,
      participantCount: (event?.participantCount as number) ?? 0,
    };
  }

  const event = await CommunityEventModel.findById(eventId).lean();
  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  const communityEvent: CommunityEvent = {
    id: event._id as string,
    title: event.title as string,
    shortDescription: event.shortDescription as string,
    description: event.description as string,
    activityType: event.activityType as CommunityEvent["activityType"],
    date: event.date as string,
    startTime: event.startTime as string,
    endTime: event.endTime as string | undefined,
    venue: event.venue as string,
    address: event.address as string,
    locationId: event.locationId as string,
    organizer: event.organizer as string,
    participantCount: event.participantCount as number,
    maxParticipants: event.maxParticipants as number | undefined,
    difficulty: event.difficulty as CommunityEvent["difficulty"],
    tags: event.tags as string[],
    recommendedProductIds: event.recommendedProductIds as string[],
    image: event.image as string,
    featured: event.featured as boolean | undefined,
  };

  if (!isEventJoinable(communityEvent)) {
    throw new Error("EVENT_ENDED");
  }

  if (isEventFull(communityEvent)) {
    throw new Error("EVENT_FULL");
  }

  const enrollment = await CommunityEnrollment.create({ userId, eventId });
  const updated = await CommunityEventModel.findByIdAndUpdate(
    eventId,
    { $inc: { participantCount: 1 } },
    { new: true },
  ).lean();

  return {
    joinedAt: enrollment.joinedAt,
    participantCount:
      (updated?.participantCount as number) ?? communityEvent.participantCount + 1,
  };
}

export async function isUserEnrolledInEvent(
  userId: string,
  eventId: string,
): Promise<boolean> {
  await connectDB();
  const row = await CommunityEnrollment.findOne({ userId, eventId })
    .select("_id")
    .lean();
  return Boolean(row);
}

export async function getUserEnrolledEventIds(userId: string): Promise<string[]> {
  await connectDB();
  const rows = await CommunityEnrollment.find({ userId }).select("eventId").lean();
  return rows.map((row) => row.eventId as string);
}
