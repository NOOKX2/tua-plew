import "server-only";

import { auth } from "@/auth";
import type { RentalTokenTransaction } from "./types";
import {
  getRentalTokenBalance,
  getRecentRentalTokenTransactions,
} from "@/lib/rental-tokens";

export async function getRentalTokenBalanceForSession(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;
  return getRentalTokenBalance(session.user.id);
}

export async function getRentalTokenSummaryForSession(): Promise<{
  balance: number;
  transactions: RentalTokenTransaction[];
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { balance: 0, transactions: [] };
  }

  const [balance, transactions] = await Promise.all([
    getRentalTokenBalance(session.user.id),
    getRecentRentalTokenTransactions(session.user.id),
  ]);

  return { balance, transactions };
}
