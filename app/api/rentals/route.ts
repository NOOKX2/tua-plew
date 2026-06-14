import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTranslatorFromRequest } from "@/lib/i18n/server";
import {
  createRentalReservation,
  getUserRentalReservations,
} from "@/lib/rentals";
import { isReservationActive } from "@/lib/rental-status";

function mapRentalError(
  code: string,
  t: ReturnType<typeof getTranslatorFromRequest>,
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
    default:
      return t("rental.errors.reserveFailed");
  }
}

export async function GET(request: Request) {
  const t = getTranslatorFromRequest(request);
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: t("rental.errors.loginRequired") },
      { status: 401 },
    );
  }

  const rentals = await getUserRentalReservations(session.user.id);
  const activeCount = rentals.filter(isReservationActive).length;
  return NextResponse.json({ rentals, activeCount });
}

export async function POST(request: Request) {
  const t = getTranslatorFromRequest(request);
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: t("rental.errors.loginRequired") },
      { status: 401 },
    );
  }

  let body: { productId?: string; locationId?: string; size?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: t("rental.errors.invalidData") },
      { status: 400 },
    );
  }

  const { productId, locationId, size } = body;
  if (!productId || !locationId || !size) {
    return NextResponse.json(
      { error: t("rental.errors.invalidData") },
      { status: 400 },
    );
  }

  try {
    const rental = await createRentalReservation({
      userId: session.user.id,
      productId,
      locationId,
      size,
    });
    return NextResponse.json({ rental });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "RESERVE_FAILED";
    const status =
      message === "OUT_OF_STOCK" || message === "TOO_MANY_PENDING"
        ? 400
        : message === "PRODUCT_NOT_FOUND" || message === "LOCATION_NOT_FOUND"
          ? 404
          : 500;

    return NextResponse.json(
      { error: mapRentalError(message, t) },
      { status },
    );
  }
}
