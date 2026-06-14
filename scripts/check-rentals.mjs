import mongoose, { Schema } from "mongoose";

const url = process.env.DATABASE_URL;
await mongoose.connect(url);

const userSchema = new Schema({ email: String });
const rentalSchema = new Schema(
  {
    userId: String,
    productId: String,
    locationId: String,
    size: String,
    status: String,
    pickupCode: String,
    expiresAt: Date,
    reservedAt: Date,
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema, "User");
const RentalReservation = mongoose.model(
  "RentalReservation",
  rentalSchema,
  "RentalReservation",
);

const user = await User.findOne({ email: "nook@gmail.com" }).lean();
const rentals = await RentalReservation.find({ userId: user?._id?.toString() })
  .sort({ reservedAt: -1 })
  .lean();

console.log(
  JSON.stringify(
    rentals.map((r) => ({
      id: r._id.toString(),
      status: r.status,
      productId: r.productId,
      size: r.size,
      expiresAt: r.expiresAt,
      pickupCode: r.pickupCode,
    })),
    null,
    2,
  ),
);

const pending = rentals.filter(
  (r) => r.status === "pending_pickup" && r.expiresAt > new Date(),
);
console.log("active pending:", pending.length);

await mongoose.disconnect();
