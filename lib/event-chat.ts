import "server-only";

import { connectDB } from "./mongoose";
import { EventChatMessage } from "./models";
import { isUserEnrolledInEvent } from "./community-enrollments";
import { getUserProfileById } from "./users.server";
import type { ChatMessage } from "./types";

type MessageRow = {
  _id: { toString(): string };
  senderId: string;
  senderName: string;
  senderImage?: string | null;
  body: string;
  createdAt: Date;
};

function mapMessage(row: MessageRow): ChatMessage {
  return {
    id: row._id.toString(),
    senderId: row.senderId,
    senderName: row.senderName,
    senderImage: row.senderImage ?? undefined,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getEventChatMessages(
  eventId: string,
  limit = 80,
): Promise<ChatMessage[]> {
  await connectDB();
  const rows = await EventChatMessage.find({ eventId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<MessageRow[]>();
  return rows.reverse().map(mapMessage);
}

export async function sendEventChatMessage(
  userId: string,
  eventId: string,
  body: string,
): Promise<ChatMessage> {
  const trimmed = body.trim();
  if (!trimmed) throw new Error("EMPTY_MESSAGE");
  if (trimmed.length > 2000) throw new Error("MESSAGE_TOO_LONG");

  const enrolled = await isUserEnrolledInEvent(userId, eventId);
  if (!enrolled) throw new Error("NOT_ENROLLED");

  const profile = await getUserProfileById(userId);
  if (!profile) throw new Error("USER_NOT_FOUND");

  await connectDB();
  const created = await EventChatMessage.create({
    eventId,
    senderId: userId,
    senderName: profile.name,
    senderImage: profile.image,
    body: trimmed,
  });

  return mapMessage({
    _id: created._id,
    senderId: created.senderId,
    senderName: created.senderName,
    senderImage: created.senderImage,
    body: created.body,
    createdAt: created.createdAt,
  });
}
