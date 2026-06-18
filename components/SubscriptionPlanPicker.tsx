"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import {
  SUBSCRIPTION_PLAN_ORDER,
  SUBSCRIPTION_PLANS,
  getPricePerRental,
  type SubscriptionPlanId,
} from "@/lib/subscription-plans";
import { useTranslations } from "@/lib/i18n/client";

type PlanTheme = {
  card: string;
  header: string;
  segment: string;
  title: string;
  price: string;
  perMonth: string;
  body: string;
  rentals: string;
  perRental: string;
  button: string;
};

const PLAN_THEMES: Record<SubscriptionPlanId, PlanTheme> = {
  basic: {
    card: "border-sky-200/90 bg-white shadow-md shadow-sky-900/5 ring-1 ring-sky-100",
    header:
      "bg-linear-to-r from-sky-500 via-sky-500 to-cyan-500 text-white",
    segment: "text-sky-100",
    title: "text-white",
    price: "text-white",
    perMonth: "text-sky-100",
    body: "bg-linear-to-b from-sky-50/60 to-white",
    rentals: "text-sky-950",
    perRental: "text-sky-700/80",
    button:
      "border border-sky-300 bg-sky-50 text-sky-800 hover:border-sky-400 hover:bg-sky-100",
  },
  standard: {
    card: "border-violet-300 bg-white shadow-md shadow-violet-900/5 ring-2 ring-violet-200/80",
    header:
      "bg-linear-to-r from-violet-600 via-violet-600 to-fuchsia-600 text-white",
    segment: "text-violet-100",
    title: "text-white",
    price: "text-white",
    perMonth: "text-violet-100",
    body: "bg-linear-to-b from-violet-50/40 to-white",
    rentals: "text-violet-950",
    perRental: "text-violet-700/80",
    button: "bg-violet-600 text-white hover:bg-violet-500 shadow-sm shadow-violet-600/25",
  },
  premium: {
    card: "border-amber-400/70 bg-white shadow-xl shadow-amber-900/15 ring-2 ring-amber-300/60",
    header:
      "relative overflow-hidden bg-linear-to-br from-amber-950 via-amber-900 to-yellow-800 text-amber-50",
    segment: "text-amber-300",
    title: "text-amber-50",
    price: "text-amber-200",
    perMonth: "text-amber-200/90",
    body: "bg-linear-to-b from-amber-50/90 via-amber-50/30 to-white",
    rentals: "text-amber-950",
    perRental: "text-amber-800/75",
    button:
      "bg-linear-to-r from-amber-500 via-yellow-500 to-amber-600 text-amber-950 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-500 shadow-md shadow-amber-500/30 font-bold",
  },
};

export default function SubscriptionPlanPicker() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {t("subscription.picker.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          {t("subscription.picker.subtitle")}
        </p>
      </div>

      <div className="space-y-3">
        {SUBSCRIPTION_PLAN_ORDER.map((planId) => {
          const plan = SUBSCRIPTION_PLANS[planId];
          const perRental = getPricePerRental(plan);
          const theme = PLAN_THEMES[planId];
          const isPremium = planId === "premium";

          return (
            <div
              key={planId}
              className={`overflow-hidden rounded-2xl border ${theme.card}`}
            >
              <div className={`px-5 py-4 ${theme.header}`}>
                {isPremium && (
                  <>
                    <div
                      className="pointer-events-none absolute inset-0 opacity-30"
                      aria-hidden
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 0%, rgba(251,191,36,0.35), transparent 45%), radial-gradient(circle at 80% 100%, rgba(234,179,8,0.2), transparent 40%)",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-400/20 blur-2xl"
                      aria-hidden
                    />
                  </>
                )}

                <div className="relative flex items-center justify-between gap-3">
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.14em] ${theme.segment}`}
                    >
                      {t(`subscription.plans.${planId}.segment`)}
                    </p>
                    <h2 className={`mt-1 text-xl font-bold ${theme.title}`}>
                      {t(`subscription.plans.${planId}.name`)}
                    </h2>
                  </div>
                  <p className={`text-right text-2xl font-bold ${theme.price}`}>
                    ฿{plan.priceBaht}
                    <span
                      className={`block text-xs font-medium ${theme.perMonth}`}
                    >
                      {t("subscription.perMonth")}
                    </span>
                  </p>
                </div>
              </div>

              <div className={`px-5 py-4 ${theme.body}`}>
                <p className={`text-sm font-semibold ${theme.rentals}`}>
                  {t("subscription.rentalsPerMonth", {
                    count: plan.rentalsPerMonth,
                  })}
                </p>
                <p className={`mt-1 text-xs ${theme.perRental}`}>
                  {t("subscription.pricePerRental", { price: perRental })}
                </p>
                <Link
                  href={`/member/subscribe/${planId}/pay`}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${theme.button}`}
                >
                  {isPremium && <Crown className="h-4 w-4" aria-hidden />}
                  {t("subscription.picker.select")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-400">
        {t("subscription.picker.note")}
      </p>
    </div>
  );
}
