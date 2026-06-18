"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getTranslator } from "@/lib/i18n/server";
import {
  cancelRentalReservation,
  createRentalReservation,
} from "@/lib/rentals";
import type { RentalPaymentMethod, RentalReservation } from "@/lib/types";
import type { ActionResult } from "./types";

function mapRentalError(
  code: string,
  t: Awaited<ReturnType<typeof getTranslator>>,
): string {
  switch (code) {
    case "TOO_MANY_PENDING":
      return t("rental.errors.tooManyPending");
    case "OUT_OF_STOCK":
      return t("rental.errors.outOfStock");
    case "PRODUCT_NOT_FOUND":
      return t("rental.errors.productNotFound");
    case "LOCATION_NOT_FOUND":
      return t("rental.errors.locationNotFound");
    case "INVALID_SIZE":
      return t("rental.errors.invalidSize");
    case "INSUFFICIENT_TOKENS":
      return t("rental.errors.insufficientTokens");
    case "INVALID_TOKEN_AMOUNT":
      return t("rental.errors.invalidTokenAmount");
    case "NO_SUBSCRIPTION_CREDIT":
      return t("rental.errors.noSubscriptionCredit");
    case "SUBSCRIPTION_EXPIRED":
      return t("rental.errors.subscriptionExpired");
    default:
      return t("rental.errors.reserveFailed");
  }
}

function mapCancelError(
  code: string,
  t: Awaited<ReturnType<typeof getTranslator>>,
): string {
  switch (code) {
    case "NOT_FOUND":
      return t("rental.errors.notFound");
    case "NOT_CANCELLABLE":
      return t("rental.errors.notCancellable");
    case "EXPIRED":
      return t("rental.errors.expired");
    default:
      return t("rental.errors.cancelFailed");
  }
}

export async function createRentalReservationAction(input: {
  productId: string;
  locationId: string;
  size: string;
  paymentMethod?: RentalPaymentMethod;
  tokensToUse?: number;
}): Promise<ActionResult<{ rental: RentalReservation }>> {
  const t = await getTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: t("rental.errors.loginRequired") };
  }

  const { productId, locationId, size, paymentMethod, tokensToUse } = input;
  if (!productId || !locationId || !size) {
    return { ok: false, error: t("rental.errors.invalidData") };
  }

  try {
    const rental = await createRentalReservation({
      userId: session.user.id,
      productId,
      locationId,
      size,
      paymentMethod,
      tokensToUse,
    });

    revalidatePath("/rentals");
    revalidatePath(`/rentals/checkout/${rental.id}`);
    revalidatePath(`/products/${productId}`);
    revalidatePath("/map");
    revalidatePath("/member");
    revalidatePath("/", "layout");

    return { ok: true, data: { rental } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "RESERVE_FAILED";
    return { ok: false, error: mapRentalError(message, t) };
  }
}

export async function cancelRentalReservationAction(
  rentalId: string,
): Promise<ActionResult<{ rental: RentalReservation }>> {
  const t = await getTranslator();
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: t("rental.errors.loginRequired") };
  }

  try {
    const rental = await cancelRentalReservation(session.user.id, rentalId);

    revalidatePath("/rentals");
    revalidatePath(`/products/${rental.productId}`);
    revalidatePath("/map");
    revalidatePath("/member");
    revalidatePath("/", "layout");

    return { ok: true, data: { rental } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "CANCEL_FAILED";
    return { ok: false, error: mapCancelError(message, t) };
  }
}
