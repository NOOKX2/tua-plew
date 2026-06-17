"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getTranslator } from "@/lib/i18n/server";
import { getRentalTokenBalance, topUpRentalTokens } from "@/lib/rental-tokens";
import {
  TOP_UP_PACKAGES,
  type TopUpPackage,
} from "@/lib/top-up-packages";
import type { ActionResult } from "./types";

export type { TopUpPackage };

export async function getRentalTokenBalanceAction(): Promise<
  ActionResult<{ balance: number }>
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  const balance = await getRentalTokenBalance(session.user.id);
  return { ok: true, data: { balance } };
}

export async function topUpRentalTokensAction(
  amount: TopUpPackage,
): Promise<ActionResult<{ balance: number }>> {
  const t = await getTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: t("rental.errors.loginRequired") };
  }

  if (!TOP_UP_PACKAGES.includes(amount)) {
    return { ok: false, error: t("rental.tokens.topUpInvalid") };
  }

  try {
    const balance = await topUpRentalTokens({
      userId: session.user.id,
      amount,
    });

    revalidatePath("/member");
    revalidatePath(`/member/tokens/top-up/${amount}`);
    revalidatePath("/", "layout");

    return { ok: true, data: { balance } };
  } catch {
    return { ok: false, error: t("rental.tokens.topUpFailed") };
  }
}
