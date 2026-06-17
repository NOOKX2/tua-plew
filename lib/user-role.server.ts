import "server-only";

import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models";
import type { UserRole } from "@/lib/types";
import { isMongoObjectId } from "@/lib/users.server";

export async function getUserRoleById(userId: string): Promise<UserRole> {
  if (!isMongoObjectId(userId)) return "user";

  await connectDB();
  const row = await User.findById(userId).select("role").lean<{ role?: UserRole }>();
  return row?.role === "admin" ? "admin" : "user";
}

export async function getUserRoleByEmail(email: string): Promise<UserRole> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return "user";

  await connectDB();
  const row = await User.findOne({ email: normalized })
    .select("role")
    .lean<{ role?: UserRole }>();
  return row?.role === "admin" ? "admin" : "user";
}

export async function resolveUserRole(
  userId?: string,
  email?: string | null,
): Promise<UserRole> {
  if (userId && isMongoObjectId(userId)) {
    const role = await getUserRoleById(userId);
    if (role === "admin") return "admin";
  }

  if (email) {
    return getUserRoleByEmail(email);
  }

  return "user";
}

export async function isAdminUser(
  userId?: string,
  email?: string | null,
): Promise<boolean> {
  return (await resolveUserRole(userId, email)) === "admin";
}
