"use client";

import { useRouter } from "next/navigation";
import type { SubscriptionPlanId } from "@/lib/subscription-plans";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";
import { activateSubscriptionAction } from "@/lib/actions/subscription";
import PaymentMethodCheckout from "./PaymentMethodCheckout";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  planId: SubscriptionPlanId;
};

export default function SubscriptionPaymentView({ planId }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const plan = SUBSCRIPTION_PLANS[planId];
  const planName = t(`subscription.plans.${planId}.name`);

  return (
    <PaymentMethodCheckout
      backHref="/member/subscribe"
      backLabel={t("subscription.payment.back")}
      title={t("subscription.payment.title")}
      subtitle={t("subscription.payment.subtitle")}
      orderTitle={t("subscription.payment.orderLabel", { plan: planName })}
      orderSubtitle={t("subscription.rentalsPerMonth", {
        count: plan.rentalsPerMonth,
      })}
      amount={plan.priceBaht}
      demoNote={t("subscription.payment.demoNote")}
      payButtonLabel={t("subscription.payment.payButton", {
        amount: plan.priceBaht,
      })}
      loadingLabel={t("subscription.payment.loading")}
      onPay={async () => {
        const result = await activateSubscriptionAction(planId);
        if (!result.ok) {
          return { ok: false as const, error: result.error };
        }

        const params = new URLSearchParams({
          subscribed: planId,
          limit: String(result.data.rentalsLimit),
        });
        router.push(`/member?${params.toString()}`);
        router.refresh();
        return { ok: true as const };
      }}
    />
  );
}
