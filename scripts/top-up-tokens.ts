import mongoose from "mongoose";
import { RentalTokenTransaction, User } from "../lib/models";

const url = process.env.DATABASE_URL;

if (
  !url?.startsWith("mongodb://") &&
  !url?.startsWith("mongodb+srv://")
) {
  throw new Error("DATABASE_URL must be a MongoDB connection string");
}

function usage() {
  console.log(`Usage:
  bun run scripts/top-up-tokens.ts --email user@example.com --amount 50

Options:
  --email   User email (required)
  --amount  Tokens to add, must be > 0 (required)`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  let email: string | undefined;
  let amount: number | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email") email = args[++i]?.trim().toLowerCase();
    if (args[i] === "--amount") amount = Number(args[++i]);
  }

  return { email, amount };
}

async function main() {
  const { email, amount } = parseArgs();

  if (!email || !amount || amount <= 0 || !Number.isFinite(amount)) {
    usage();
    process.exit(1);
  }

  await mongoose.connect(url!);

  const user = await User.findOne({ email }).select("_id rentalTokenBalance");
  if (!user) {
    throw new Error(`No user found with email: ${email}`);
  }

  await User.updateOne(
    { _id: user._id },
    { $inc: { rentalTokenBalance: amount } },
  );

  await RentalTokenTransaction.create({
    userId: user._id.toString(),
    amount,
    type: "topup",
    description: "admin-script",
  });

  const updated = await User.findById(user._id)
    .select("rentalTokenBalance")
    .lean();

  console.log(
    `Topped up ${amount} tokens for ${email}. New balance: ${updated?.rentalTokenBalance ?? 0}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
