import "server-only";

import { connectDB } from "./mongoose";
import { CommunityEnrollment } from "./models";
import { getFriendshipStatusMap } from "./friendships";
import { getUserProfilesByIds } from "./users.server";
import type { EventParticipant } from "./types";

export async function getEventParticipants(
  eventId: string,
  viewerId?: string,
): Promise<EventParticipant[]> {
  await connectDB();
  const enrollments = await CommunityEnrollment.find({ eventId })
    .select("userId")
    .lean<{ userId: string }[]>();

  const userIds = [...new Set(enrollments.map((row) => row.userId))];
  const profiles = await getUserProfilesByIds(userIds);
  const statusMap = viewerId
    ? await getFriendshipStatusMap(viewerId, userIds)
    : new Map<string, null>();

  return profiles
    .map((profile) => {
      const status = statusMap.get(profile.id) ?? undefined;
      return {
        ...profile,
        isFriend: status === "accepted",
        friendshipStatus: status ?? undefined,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "th"));
}
