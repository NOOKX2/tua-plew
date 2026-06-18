export const SUBSCRIPTION_PLAN_ORDER = ["basic", "standard", "premium"] as const;

export type SubscriptionPlanId = (typeof SUBSCRIPTION_PLAN_ORDER)[number];

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  priceBaht: number;
  rentalsPerMonth: number;
};

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanId, SubscriptionPlan> = {
  basic: { id: "basic", priceBaht: 390, rentalsPerMonth: 4 },
  standard: { id: "standard", priceBaht: 690, rentalsPerMonth: 8 },
  premium: { id: "premium", priceBaht: 1190, rentalsPerMonth: 15 },
};

export function parseSubscriptionPlan(
  value: string,
): SubscriptionPlanId | null {
  if (
    SUBSCRIPTION_PLAN_ORDER.includes(value as SubscriptionPlanId)
  ) {
    return value as SubscriptionPlanId;
  }
  return null;
}

export function getSubscriptionPlan(planId: SubscriptionPlanId): SubscriptionPlan {
  return SUBSCRIPTION_PLANS[planId];
}

export function getPricePerRental(plan: SubscriptionPlan): number {
  return Math.round((plan.priceBaht / plan.rentalsPerMonth) * 100) / 100;
}
