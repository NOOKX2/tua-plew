import mongoose from "mongoose";
import crypto from "crypto";
import {
  LocationStock,
  Product,
  RentalLocation,
  RentalReservation,
  User,
} from "../lib/models.ts";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL missing");

await mongoose.connect(url);

const user = await User.findOne({ email: "nook@gmail.com" }).lean();
if (!user) throw new Error("user not found");

const userId = user._id.toString();
const input = {
  userId,
  productId: "leggings",
  locationId: "asoke",
  size: "XS",
};

async function decrementStock(locationId, productId, size) {
  const inventoryKey = `inventory.${size}`;
  const result = await LocationStock.updateOne(
    {
      locationId,
      productId,
      [inventoryKey]: { $gte: 1 },
    },
    { $inc: { [inventoryKey]: -1 } },
  );
  return result.modifiedCount === 1;
}

const [product, location] = await Promise.all([
  Product.findById(input.productId).lean(),
  RentalLocation.findById(input.locationId).lean(),
]);

console.log("product", !!product, "location", !!location);
console.log("sizes includes", product?.sizes?.includes(input.size));

const ok = await decrementStock(
  input.locationId,
  input.productId,
  input.size,
);
console.log("decrement", ok);

const pickupCode = "ABC123";
try {
  const doc = await RentalReservation.create({
    userId: input.userId,
    productId: input.productId,
    locationId: input.locationId,
    size: input.size,
    status: "pending_pickup",
    pickupCode,
    price: product.pricePerRental,
    productName: product.name,
    locationName: location.name,
    locationAddress: location.address,
    reservedAt: new Date(),
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
  });
  console.log("SUCCESS", doc._id.toString());
  await RentalReservation.deleteOne({ _id: doc._id });
  await LocationStock.updateOne(
    { locationId: input.locationId, productId: input.productId },
    { $inc: { [`inventory.${input.size}`]: 1 } },
  );
} catch (error) {
  console.error("FAIL", error);
}

await mongoose.disconnect();
