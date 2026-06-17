import mongoose from "mongoose";
import { User } from "../lib/models";

const url = process.env.DATABASE_URL;

if (
  !url?.startsWith("mongodb://") &&
  !url?.startsWith("mongodb+srv://")
) {
  throw new Error("DATABASE_URL must be a MongoDB connection string");
}

async function main() {
  await mongoose.connect(url!);

  const result = await User.updateMany(
    {
      $or: [
        { role: { $exists: false } },
        { role: { $nin: ["user", "admin"] } },
      ],
    },
    { $set: { role: "user" } },
  );

  const [total, admins, users] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ role: "user" }),
  ]);

  console.log(
    `Migrated ${result.modifiedCount} user(s) to role "user". Total: ${total} (${admins} admin, ${users} user)`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
