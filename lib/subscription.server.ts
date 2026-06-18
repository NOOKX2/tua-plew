import "server-only";

import { auth } from "@/auth";
import { getSubscriptionStatus } from "./subscription";

export async function getSubscriptionStatusForSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      plan: null,
      rentalsUsed: 0,
      rentalsLimit: 0,
      remaining: 0,
      periodStart: null,
      periodEnd: null,
      isActive: false,
    } as const;
  }

  return getSubscriptionStatus(session.user.id);
}
