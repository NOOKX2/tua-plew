import mongoose from "mongoose";
import { User } from "../lib/models";

const url = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

if (
  !url?.startsWith("mongodb://") &&
  !url?.startsWith("mongodb+srv://")
) {
  throw new Error("DATABASE_URL must be a MongoDB connection string");
}

if (!email) {
  throw new Error("Set ADMIN_EMAIL in .env.local to the user email to promote");
}

async function main() {
  await mongoose.connect(url);

  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true },
  );

  if (!user) {
    throw new Error(`No user found with email: ${email}`);
  }

  console.log(`Promoted ${email} to admin`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
