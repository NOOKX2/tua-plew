import "server-only";

import type { SubscriptionPlanId } from "./subscription-plans";
import {
  getSubscriptionPlan,
  parseSubscriptionPlan,
} from "./subscription-plans";
import { connectDB } from "./mongoose";
import { User } from "./models";

export type SubscriptionStatus = {
  plan: SubscriptionPlanId | null;
  rentalsUsed: number;
  rentalsLimit: number;
  remaining: number;
  periodStart: string | null;
  periodEnd: string | null;
  isActive: boolean;
};

type UserSubscriptionRow = {
  subscriptionPlan?: string | null;
  subscriptionPeriodStart?: Date | null;
  subscriptionRentalsUsed?: number;
};

function getPeriodEnd(start: Date): Date {
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return end;
}

function mapSubscriptionStatus(row: UserSubscriptionRow): SubscriptionStatus {
  const plan = row.subscriptionPlan
    ? parseSubscriptionPlan(row.subscriptionPlan)
    : null;

  if (!plan || !row.subscriptionPeriodStart) {
    return {
      plan: null,
      rentalsUsed: 0,
      rentalsLimit: 0,
      remaining: 0,
      periodStart: null,
      periodEnd: null,
      isActive: false,
    };
  }

  const periodStart = row.subscriptionPeriodStart;
  const periodEnd = getPeriodEnd(periodStart);
  const now = new Date();
  const isActive = now < periodEnd;
  const rentalsLimit = getSubscriptionPlan(plan).rentalsPerMonth;
  const rentalsUsed = isActive ? (row.subscriptionRentalsUsed ?? 0) : 0;
  const remaining = isActive
    ? Math.max(0, rentalsLimit - rentalsUsed)
    : 0;

  return {
    plan,
    rentalsUsed,
    rentalsLimit,
    remaining,
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    isActive: isActive && remaining > 0,
  };
}

export async function getSubscriptionStatus(
  userId: string,
): Promise<SubscriptionStatus> {
  await connectDB();
  const user = await User.findById(userId)
    .select(
      "subscriptionPlan subscriptionPeriodStart subscriptionRentalsUsed",
    )
    .lean<UserSubscriptionRow>();

  if (!user) {
    return {
      plan: null,
      rentalsUsed: 0,
      rentalsLimit: 0,
      remaining: 0,
      periodStart: null,
      periodEnd: null,
      isActive: false,
    };
  }

  return mapSubscriptionStatus(user);
}

export async function canUseSubscriptionCredit(userId: string): Promise<boolean> {
  const status = await getSubscriptionStatus(userId);
  return status.isActive && status.remaining > 0;
}

export async function consumeSubscriptionCredit(
  userId: string,
  rentalId: string,
): Promise<void> {
  await connectDB();

  const user = await User.findById(userId)
    .select(
      "subscriptionPlan subscriptionPeriodStart subscriptionRentalsUsed",
    )
    .lean<UserSubscriptionRow>();

  if (!user?.subscriptionPlan || !user.subscriptionPeriodStart) {
    throw new Error("NO_SUBSCRIPTION_CREDIT");
  }

  const plan = parseSubscriptionPlan(user.subscriptionPlan);
  if (!plan) throw new Error("NO_SUBSCRIPTION_CREDIT");

  const periodEnd = getPeriodEnd(user.subscriptionPeriodStart);
  if (new Date() >= periodEnd) {
    throw new Error("SUBSCRIPTION_EXPIRED");
  }

  const limit = getSubscriptionPlan(plan).rentalsPerMonth;

  const result = await User.updateOne(
    {
      _id: userId,
      subscriptionPlan: plan,
      subscriptionPeriodStart: user.subscriptionPeriodStart,
      subscriptionRentalsUsed: { $lt: limit },
    },
    { $inc: { subscriptionRentalsUsed: 1 } },
  );

  if (result.modifiedCount !== 1) {
    throw new Error("NO_SUBSCRIPTION_CREDIT");
  }

  void rentalId;
}

export async function refundSubscriptionCredit(userId: string): Promise<void> {
  await connectDB();

  await User.updateOne(
    { _id: userId, subscriptionRentalsUsed: { $gt: 0 } },
    { $inc: { subscriptionRentalsUsed: -1 } },
  );
}

export async function activateSubscription(
  userId: string,
  planId: SubscriptionPlanId,
): Promise<SubscriptionStatus> {
  await connectDB();

  const now = new Date();

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        subscriptionPlan: planId,
        subscriptionPeriodStart: now,
        subscriptionRentalsUsed: 0,
      },
    },
  );

  return getSubscriptionStatus(userId);
}
