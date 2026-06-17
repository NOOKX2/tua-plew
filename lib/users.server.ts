import "server-only";

import { connectDB } from "./mongoose";
import { User } from "./models";
import type { UserProfile } from "./types";

type UserRow = {
  _id: { toString(): string };
  name?: string | null;
  email: string;
  image?: string | null;
  role?: string | null;
};

export function isMongoObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}

function mapUserProfile(row: UserRow): UserProfile {
  return {
    id: row._id.toString(),
    name: row.name?.trim() || row.email.split("@")[0] || "User",
    email: row.email,
    image: row.image ?? undefined,
    role: row.role === "admin" ? "admin" : "user",
  };
}

export async function getUserProfileById(
  userId: string,
): Promise<UserProfile | null> {
  if (!isMongoObjectId(userId)) return null;

  await connectDB();
  const row = await User.findById(userId)
    .select("name email image role")
    .lean<UserRow | null>();
  return row ? mapUserProfile(row) : null;
}

export async function getUserProfilesByIds(
  userIds: string[],
): Promise<UserProfile[]> {
  const objectIds = [...new Set(userIds.filter(isMongoObjectId))];
  if (objectIds.length === 0) return [];

  await connectDB();
  const rows = await User.find({ _id: { $in: objectIds } })
    .select("name email image role")
    .lean<UserRow[]>();
  return rows.map(mapUserProfile);
}

export async function findUserByEmail(
  email: string,
): Promise<UserProfile | null> {
  await connectDB();
  const row = await User.findOne({ email: email.trim().toLowerCase() })
    .select("name email image role")
    .lean<UserRow | null>();
  return row ? mapUserProfile(row) : null;
}
