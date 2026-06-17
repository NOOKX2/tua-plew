"use client";

import { useRouter } from "next/navigation";
import type { TopUpPackage } from "@/lib/top-up-packages";
import { topUpRentalTokensAction } from "@/lib/actions/rental-tokens";
import PaymentMethodCheckout from "./PaymentMethodCheckout";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  amount: TopUpPackage;
};

export default function TokenTopUpPaymentView({ amount }: Props) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <PaymentMethodCheckout
      backHref="/member"
      backLabel={t("rental.tokens.payment.back")}
      title={t("rental.tokens.payment.title")}
      subtitle={t("rental.tokens.payment.subtitle")}
      orderTitle={t("rental.tokens.payment.orderLabel", { amount })}
      orderSubtitle={t("rental.tokenRate")}
      amount={amount}
      demoNote={t("rental.tokens.topUpNote")}
      payButtonLabel={t("rental.tokens.payment.payButton", { amount })}
      loadingLabel={t("rental.tokens.topUpLoading")}
      onPay={async () => {
        const result = await topUpRentalTokensAction(amount);
        if (!result.ok) {
          return { ok: false as const, error: result.error };
        }

        const params = new URLSearchParams({
          topup: String(amount),
          balance: String(result.data.balance),
        });
        router.push(`/member?${params.toString()}`);
        router.refresh();
        return { ok: true as const };
      }}
    />
  );
}
