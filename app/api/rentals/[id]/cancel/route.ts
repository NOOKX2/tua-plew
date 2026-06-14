import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTranslatorFromRequest } from "@/lib/i18n/server";
import { cancelRentalReservation } from "@/lib/rentals";

type Params = { params: Promise<{ id: string }> };

function mapCancelError(
  code: string,
  t: ReturnType<typeof getTranslatorFromRequest>,
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

export async function POST(request: Request, { params }: Params) {
  const t = getTranslatorFromRequest(request);
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: t("rental.errors.loginRequired") },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const rental = await cancelRentalReservation(session.user.id, id);
    return NextResponse.json({ rental });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CANCEL_FAILED";
    const status =
      message === "NOT_FOUND"
        ? 404
        : message === "NOT_CANCELLABLE" || message === "EXPIRED"
          ? 400
          : 500;

    return NextResponse.json(
      { error: mapCancelError(message, t) },
      { status },
    );
  }
}
