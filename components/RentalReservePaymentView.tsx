"use client";

import { useRouter } from "next/navigation";
import { createRentalReservationAction } from "@/lib/actions/rentals";
import PaymentMethodCheckout from "./PaymentMethodCheckout";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  size: string;
  amount: number;
};

export default function RentalReservePaymentView({
  productId,
  productName,
  locationId,
  locationName,
  size,
  amount,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const backHref = `/products/${productId}`;

  return (
    <PaymentMethodCheckout
      backHref={backHref}
      backLabel={t("rental.payment.backToProduct")}
      title={t("rental.tokens.payment.title")}
      subtitle={t("rental.payment.subtitle")}
      orderTitle={t("rental.payment.orderLabel", { product: productName, size })}
      orderSubtitle={t("rental.payment.locationLabel", { location: locationName })}
      amount={amount}
      demoNote={t("rental.checkout.payment.mockNote")}
      payButtonLabel={t("rental.tokens.payment.payButton", { amount })}
      loadingLabel={t("rental.reserving")}
      onPay={async () => {
        const result = await createRentalReservationAction({
          productId,
          locationId,
          size,
          paymentMethod: "cash",
        });

        if (!result.ok) {
          return { ok: false as const, error: result.error };
        }

        router.push(`/rentals/checkout/${result.data.rental.id}`);
        router.refresh();
        return { ok: true as const };
      }}
    />
  );
}
