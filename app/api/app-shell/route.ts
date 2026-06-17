import { auth } from "@/auth";
import { toAppSessionUser } from "@/lib/auth-session";
import { getUserEnrolledCampaignIds } from "@/lib/campaign-enrollments";
import { getUserEnrolledEventIds } from "@/lib/community-enrollments";
import { connectDB } from "@/lib/mongoose";
import { RentalReservation as RentalReservationModel } from "@/lib/models";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return Response.json({
      sessionUser: null,
      activeRentalCount: 0,
      enrolledEventIds: [] as string[],
      enrolledCampaignIds: [] as string[],
    });
  }

  const [activeRentalCount, enrolledEventIds, enrolledCampaignIds] =
    await Promise.all([
      (async () => {
        await connectDB();
        return RentalReservationModel.countDocuments({
          userId,
          status: "pending_pickup",
          expiresAt: { $gt: new Date() },
        });
      })(),
      getUserEnrolledEventIds(userId),
      getUserEnrolledCampaignIds(userId),
    ]);

  return Response.json({
    sessionUser: toAppSessionUser(session),
    activeRentalCount,
    enrolledEventIds,
    enrolledCampaignIds,
  });
}
