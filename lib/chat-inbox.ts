import "server-only";

import { connectDB } from "./mongoose";
import {
  CommunityEnrollment,
  CommunityEvent,
  EventChatMessage,
} from "./models";
import { getUserEnrolledEventIds } from "./community-enrollments";
import { getDirectConversations } from "./direct-chat";
import type { ChatInboxItem } from "./types";

type EventRow = {
  _id: string;
  title: string;
  image: string;
  date: string;
};

type EnrollmentRow = {
  eventId: string;
  joinedAt: Date;
};

type LastEventMessageRow = {
  _id: string;
  lastMessage: string;
  lastMessageAt: Date;
};

export async function getChatInboxForUser(
  userId: string,
): Promise<ChatInboxItem[]> {
  const [directConversations, enrolledEventIds] = await Promise.all([
    getDirectConversations(userId),
    getUserEnrolledEventIds(userId),
  ]);

  const items: ChatInboxItem[] = directConversations.map((conversation) => ({
    id: conversation.id,
    kind: "direct",
    title: conversation.otherUser.name,
    image: conversation.otherUser.image,
    lastMessage: conversation.lastMessage,
    lastMessageAt:
      conversation.lastMessageAt ?? new Date(0).toISOString(),
    href: `/community/messages/${conversation.id}`,
  }));

  if (enrolledEventIds.length === 0) {
    return items.sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime(),
    );
  }

  await connectDB();

  const [events, enrollments, lastMessages] = await Promise.all([
    CommunityEvent.find({ _id: { $in: enrolledEventIds } })
      .select("_id title image date")
      .lean<EventRow[]>(),
    CommunityEnrollment.find({ userId, eventId: { $in: enrolledEventIds } })
      .select("eventId joinedAt")
      .lean<EnrollmentRow[]>(),
    EventChatMessage.aggregate<LastEventMessageRow>([
      { $match: { eventId: { $in: enrolledEventIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$eventId",
          lastMessage: { $first: "$body" },
          lastMessageAt: { $first: "$createdAt" },
        },
      },
    ]),
  ]);

  const joinedAtByEvent = new Map(
    enrollments.map((row) => [row.eventId, row.joinedAt]),
  );
  const lastMessageByEvent = new Map(
    lastMessages.map((row) => [row._id, row]),
  );

  for (const event of events) {
    const last = lastMessageByEvent.get(event._id);
    const joinedAt = joinedAtByEvent.get(event._id);
    const fallbackDate = joinedAt ?? new Date(`${event.date}T00:00:00`);

    items.push({
      id: event._id,
      kind: "event",
      title: event.title,
      image: event.image,
      lastMessage: last?.lastMessage,
      lastMessageAt: (last?.lastMessageAt ?? fallbackDate).toISOString(),
      href: `/community/${event._id}/chat`,
    });
  }

  return items.sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
}
