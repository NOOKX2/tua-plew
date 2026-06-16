import "server-only";

import { connectDB } from "./mongoose";
import { Friendship } from "./models";
import { getUserProfilesByIds } from "./users.server";
import type { FriendshipStatus, FriendshipView, UserProfile } from "./types";

type FriendshipRow = {
  _id: { toString(): string };
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: Date;
};

async function findFriendshipBetween(userA: string, userB: string) {
  await connectDB();
  return Friendship.findOne({
    $or: [
      { requesterId: userA, addresseeId: userB },
      { requesterId: userB, addresseeId: userA },
    ],
  }).lean<FriendshipRow | null>();
}

function toFriendshipView(
  row: FriendshipRow,
  viewerId: string,
  usersById: Map<string, UserProfile>,
): FriendshipView | null {
  const otherUserId =
    row.requesterId === viewerId ? row.addresseeId : row.requesterId;
  const user = usersById.get(otherUserId);
  if (!user) return null;

  let direction: FriendshipView["direction"] = "friend";
  if (row.status === "pending") {
    direction = row.requesterId === viewerId ? "outgoing" : "incoming";
  }

  return {
    id: row._id.toString(),
    user,
    status: row.status,
    direction,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function areFriends(
  userA: string,
  userB: string,
): Promise<boolean> {
  const row = await findFriendshipBetween(userA, userB);
  return row?.status === "accepted";
}

export async function getFriendshipViews(
  userId: string,
): Promise<FriendshipView[]> {
  await connectDB();
  const rows = await Friendship.find({
    $or: [{ requesterId: userId }, { addresseeId: userId }],
    status: { $ne: "blocked" },
  })
    .sort({ updatedAt: -1 })
    .lean<FriendshipRow[]>();

  const otherIds = rows.map((row) =>
    row.requesterId === userId ? row.addresseeId : row.requesterId,
  );
  const users = await getUserProfilesByIds(otherIds);
  const usersById = new Map(users.map((user) => [user.id, user]));

  return rows
    .map((row) => toFriendshipView(row, userId, usersById))
    .filter((item): item is FriendshipView => item !== null);
}

export async function getAcceptedFriends(
  userId: string,
): Promise<UserProfile[]> {
  const views = await getFriendshipViews(userId);
  return views
    .filter((view) => view.status === "accepted")
    .map((view) => view.user);
}

export async function sendFriendRequest(
  requesterId: string,
  addresseeId: string,
): Promise<FriendshipView> {
  if (requesterId === addresseeId) {
    throw new Error("SELF_REQUEST");
  }

  const existing = await findFriendshipBetween(requesterId, addresseeId);
  if (existing) {
    if (existing.status === "accepted") throw new Error("ALREADY_FRIENDS");
    if (existing.status === "blocked") throw new Error("BLOCKED");
    if (existing.status === "pending") {
      if (existing.requesterId === addresseeId) {
        await connectDB();
        await Friendship.updateOne(
          { _id: existing._id },
          { $set: { status: "accepted" } },
        );
        const users = await getUserProfilesByIds([addresseeId]);
        const usersById = new Map(users.map((user) => [user.id, user]));
        return toFriendshipView(
          { ...existing, status: "accepted" },
          requesterId,
          usersById,
        )!;
      }
      throw new Error("REQUEST_EXISTS");
    }
  }

  await connectDB();
  const created = await Friendship.create({
    requesterId,
    addresseeId,
    status: "pending",
  });
  const users = await getUserProfilesByIds([addresseeId]);
  const usersById = new Map(users.map((user) => [user.id, user]));
  return toFriendshipView(
    {
      _id: created._id,
      requesterId,
      addresseeId,
      status: "pending",
      createdAt: created.createdAt,
    },
    requesterId,
    usersById,
  )!;
}

export async function acceptFriendRequest(
  userId: string,
  friendshipId: string,
): Promise<void> {
  await connectDB();
  const row = await Friendship.findById(friendshipId).lean<FriendshipRow | null>();
  if (!row || row.addresseeId !== userId || row.status !== "pending") {
    throw new Error("NOT_FOUND");
  }
  await Friendship.updateOne({ _id: friendshipId }, { $set: { status: "accepted" } });
}

export async function declineFriendRequest(
  userId: string,
  friendshipId: string,
): Promise<void> {
  await connectDB();
  const row = await Friendship.findById(friendshipId).lean<FriendshipRow | null>();
  if (!row) throw new Error("NOT_FOUND");
  const canDecline =
    row.addresseeId === userId ||
    row.requesterId === userId;
  if (!canDecline) throw new Error("NOT_FOUND");
  await Friendship.deleteOne({ _id: friendshipId });
}

export async function removeFriend(
  userId: string,
  friendshipId: string,
): Promise<void> {
  await connectDB();
  const row = await Friendship.findById(friendshipId).lean<FriendshipRow | null>();
  if (!row) throw new Error("NOT_FOUND");
  if (row.requesterId !== userId && row.addresseeId !== userId) {
    throw new Error("NOT_FOUND");
  }
  await Friendship.deleteOne({ _id: friendshipId });
}

export async function getFriendshipStatusMap(
  viewerId: string,
  otherUserIds: string[],
): Promise<Map<string, FriendshipStatus | null>> {
  if (otherUserIds.length === 0) return new Map();

  await connectDB();
  const rows = await Friendship.find({
    $or: [
      { requesterId: viewerId, addresseeId: { $in: otherUserIds } },
      { addresseeId: viewerId, requesterId: { $in: otherUserIds } },
    ],
  }).lean<FriendshipRow[]>();

  const map = new Map<string, FriendshipStatus | null>();
  for (const id of otherUserIds) {
    map.set(id, null);
  }
  for (const row of rows) {
    const otherId =
      row.requesterId === viewerId ? row.addresseeId : row.requesterId;
    map.set(otherId, row.status);
  }
  return map;
}
