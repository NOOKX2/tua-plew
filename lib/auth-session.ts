import type { Session } from "next-auth";
import type { UserRole } from "@/lib/types";

export type AppSessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
};

export function toAppSessionUser(
  session: Session | null | undefined,
): AppSessionUser | null {
  if (!session?.user?.id) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
  };
}

export function isAuthenticatedUser(
  session: Session | null | undefined,
): boolean {
  return Boolean(session?.user?.id);
}
