import mongoose from "mongoose";
import { RentalTokenTransaction, User } from "../lib/models";

const WELCOME_TOKEN_BONUS = 100;

const url = process.env.DATABASE_URL;

if (
  !url?.startsWith("mongodb://") &&
  !url?.startsWith("mongodb+srv://")
) {
  throw new Error("DATABASE_URL must be a MongoDB connection string");
}

async function grantWelcomeBonus(userId: string): Promise<boolean> {
  const existing = await RentalTokenTransaction.findOne({
    userId,
    type: "welcome",
  }).lean();

  if (existing) return false;

  const result = await User.updateOne(
    { _id: userId },
    { $inc: { rentalTokenBalance: WELCOME_TOKEN_BONUS } },
  );

  if (result.matchedCount !== 1) return false;

  await RentalTokenTransaction.create({
    userId,
    amount: WELCOME_TOKEN_BONUS,
    type: "welcome",
    description: "welcome",
  });

  return true;
}

async function main() {
  await mongoose.connect(url!);

  const users = await User.find().select("_id").lean();
  let granted = 0;

  for (const user of users) {
    const didGrant = await grantWelcomeBonus(user._id.toString());
    if (didGrant) granted += 1;
  }

  const totalBalance = await User.aggregate<{ total: number }>([
    { $group: { _id: null, total: { $sum: "$rentalTokenBalance" } } },
  ]);

  console.log(
    `Granted welcome tokens to ${granted} user(s). Total token balance in system: ${totalBalance[0]?.total ?? 0}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
