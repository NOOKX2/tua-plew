import "server-only";

import mongoose from "mongoose";
import { connectDB } from "./mongoose";
import { DirectConversation, DirectMessage } from "./models";
import { areFriends } from "./friendships";
import { getUserProfileById, getUserProfilesByIds } from "./users.server";
import type { ChatMessage, DirectConversationSummary } from "./types";

type ConversationRow = {
  _id: { toString(): string };
  participantIds: string[];
  lastMessageAt: Date;
  lastMessagePreview: string;
};

type MessageRow = {
  _id: { toString(): string };
  senderId: string;
  senderName: string;
  senderImage?: string | null;
  body: string;
  createdAt: Date;
};

function participantKey(userA: string, userB: string) {
  return [userA, userB].sort().join(":");
}

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

export async function getDirectConversations(
  userId: string,
): Promise<DirectConversationSummary[]> {
  await connectDB();
  const rows = await DirectConversation.find({ participantIds: userId })
    .sort({ lastMessageAt: -1 })
    .lean<ConversationRow[]>();

  const otherIds = rows.map((row) =>
    row.participantIds.find((id) => id !== userId) ?? "",
  );
  const users = await getUserProfilesByIds(otherIds.filter(Boolean));
  const usersById = new Map(users.map((user) => [user.id, user]));

  const conversations: DirectConversationSummary[] = [];

  for (const row of rows) {
    const otherId = row.participantIds.find((id) => id !== userId);
    if (!otherId) continue;

    const otherUser = usersById.get(otherId);
    if (!otherUser) continue;

    const item: DirectConversationSummary = {
      id: row._id.toString(),
      otherUser,
      lastMessageAt: row.lastMessageAt.toISOString(),
    };
    if (row.lastMessagePreview) {
      item.lastMessage = row.lastMessagePreview;
    }
    conversations.push(item);
  }

  return conversations;
}

export async function getOrCreateDirectConversation(
  userId: string,
  friendUserId: string,
): Promise<string> {
  if (userId === friendUserId) throw new Error("SELF_CHAT");

  const friends = await areFriends(userId, friendUserId);
  if (!friends) throw new Error("NOT_FRIENDS");

  await connectDB();
  const key = participantKey(userId, friendUserId);
  const existing = await DirectConversation.findOne({ participantKey: key })
    .select("_id")
    .lean<{ _id: { toString(): string } } | null>();
  if (existing) return existing._id.toString();

  const created = await DirectConversation.create({
    participantKey: key,
    participantIds: [userId, friendUserId].sort(),
  });
  return created._id.toString();
}

export async function userCanAccessConversation(
  userId: string,
  conversationId: string,
): Promise<boolean> {
  await connectDB();
  const row = await DirectConversation.findById(conversationId)
    .select("participantIds")
    .lean<{ participantIds: string[] } | null>();
  return Boolean(row?.participantIds.includes(userId));
}

export async function getDirectMessages(
  conversationId: string,
  limit = 80,
): Promise<ChatMessage[]> {
  await connectDB();
  const rows = await DirectMessage.find({
    conversationId: new mongoose.Types.ObjectId(conversationId),
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<MessageRow[]>();
  return rows.reverse().map(mapMessage);
}

export async function sendDirectMessage(
  userId: string,
  conversationId: string,
  body: string,
): Promise<ChatMessage> {
  const trimmed = body.trim();
  if (!trimmed) throw new Error("EMPTY_MESSAGE");
  if (trimmed.length > 2000) throw new Error("MESSAGE_TOO_LONG");

  const canAccess = await userCanAccessConversation(userId, conversationId);
  if (!canAccess) throw new Error("NOT_ALLOWED");

  await connectDB();
  const conversation = await DirectConversation.findById(conversationId)
    .select("participantIds")
    .lean<{ participantIds: string[] } | null>();
  if (!conversation) throw new Error("NOT_FOUND");

  const otherUserId = conversation.participantIds.find((id) => id !== userId);
  if (!otherUserId) throw new Error("NOT_FOUND");

  const friends = await areFriends(userId, otherUserId);
  if (!friends) throw new Error("NOT_FRIENDS");

  const profile = await getUserProfileById(userId);
  if (!profile) throw new Error("USER_NOT_FOUND");

  const created = await DirectMessage.create({
    conversationId: new mongoose.Types.ObjectId(conversationId),
    senderId: userId,
    senderName: profile.name,
    senderImage: profile.image,
    body: trimmed,
  });

  await DirectConversation.updateOne(
    { _id: conversationId },
    {
      $set: {
        lastMessageAt: created.createdAt,
        lastMessagePreview: trimmed.slice(0, 120),
      },
    },
  );

  return mapMessage({
    _id: created._id,
    senderId: created.senderId,
    senderName: created.senderName,
    senderImage: created.senderImage,
    body: created.body,
    createdAt: created.createdAt,
  });
}
