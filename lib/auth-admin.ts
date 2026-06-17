import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminUser, resolveUserRole } from "@/lib/user-role.server";

export async function requireAdmin(callbackUrl = "/admin") {
  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const role = await resolveUserRole(session?.user?.id, session?.user?.email);
  if (role !== "admin") {
    redirect("/");
  }

  return session!;
}

// Re-export for callers that only need role checks
export { isAdminUser, resolveUserRole } from "@/lib/user-role.server";
