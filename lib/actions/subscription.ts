"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getTranslator } from "@/lib/i18n/server";
import {
  activateSubscription,
  getSubscriptionStatus,
} from "@/lib/subscription";
import {
  getSubscriptionPlan,
  parseSubscriptionPlan,
  type SubscriptionPlanId,
} from "@/lib/subscription-plans";
import type { ActionResult } from "./types";
import type { SubscriptionStatus } from "@/lib/subscription";

function mapSubscriptionError(
  code: string,
  t: Awaited<ReturnType<typeof getTranslator>>,
): string {
  switch (code) {
    case "INVALID_PLAN":
      return t("subscription.errors.invalidPlan");
    case "LOGIN_REQUIRED":
      return t("subscription.errors.loginRequired");
    default:
      return t("subscription.errors.activateFailed");
  }
}

export async function getSubscriptionStatusAction(): Promise<
  ActionResult<SubscriptionStatus>
> {
  const t = await getTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: t("subscription.errors.loginRequired") };
  }

  const status = await getSubscriptionStatus(session.user.id);
  return { ok: true, data: status };
}

export async function activateSubscriptionAction(
  planId: string,
): Promise<ActionResult<SubscriptionStatus>> {
  const t = await getTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: t("subscription.errors.loginRequired") };
  }

  const plan = parseSubscriptionPlan(planId);
  if (!plan) {
    return { ok: false, error: t("subscription.errors.invalidPlan") };
  }

  try {
    const status = await activateSubscription(session.user.id, plan);

    revalidatePath("/member");
    revalidatePath("/member/subscribe");
    revalidatePath("/", "layout");

    return { ok: true, data: status };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ACTIVATE_FAILED";
    return { ok: false, error: mapSubscriptionError(message, t) };
  }
}

export async function getSubscriptionPlanSummaryAction(
  planId: string,
): Promise<
  ActionResult<{
    plan: SubscriptionPlanId;
    priceBaht: number;
    rentalsPerMonth: number;
  }>
> {
  const t = await getTranslator();
  const plan = parseSubscriptionPlan(planId);

  if (!plan) {
    return { ok: false, error: t("subscription.errors.invalidPlan") };
  }

  const summary = getSubscriptionPlan(plan);
  return {
    ok: true,
    data: {
      plan: summary.id,
      priceBaht: summary.priceBaht,
      rentalsPerMonth: summary.rentalsPerMonth,
    },
  };
}
