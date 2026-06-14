import mongoose, { Schema } from "mongoose";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const productSchema = new Schema(
  { _id: String, name: String, sizes: [String], pricePerRental: Number },
  { _id: false },
);
const locationSchema = new Schema(
  { _id: String, name: String, address: String },
  { _id: false },
);
const stockSchema = new Schema({
  locationId: String,
  productId: String,
  inventory: Schema.Types.Mixed,
});
const userSchema = new Schema({ email: String });
const rentalSchema = new Schema(
  {
    userId: String,
    productId: String,
    locationId: String,
    size: String,
    status: String,
    pickupCode: String,
    price: Number,
    productName: String,
    locationName: String,
    locationAddress: String,
    reservedAt: Date,
    expiresAt: Date,
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema, "Product");
const RentalLocation = mongoose.model(
  "RentalLocation",
  locationSchema,
  "RentalLocation",
);
const LocationStock = mongoose.model(
  "LocationStock",
  stockSchema,
  "LocationStock",
);
const User = mongoose.model("User", userSchema, "User");
const RentalReservation = mongoose.model(
  "RentalReservation",
  rentalSchema,
  "RentalReservation",
);

await mongoose.connect(url);

const user = await User.findOne({ email: "nook@gmail.com" }).lean();
const product = await Product.findById("leggings").lean();
const location = await RentalLocation.findById("asoke").lean();
const stockDoc = await LocationStock.findOne({
  locationId: "asoke",
  productId: "leggings",
});
const stock = stockDoc?.toObject();

console.log("user:", user?._id?.toString());
console.log("product:", product?._id, product?.sizes);
console.log("location:", location?._id);
console.log("stock doc inventory:", stockDoc?.inventory);
console.log("spread inventory:", { ...stockDoc?.inventory });
console.log("stock XS:", stock?.inventory?.XS);

if (!user || !product || !location || !stock) {
  process.exit(1);
}

const inventory = { ...stock.inventory };
const size = "XS";
if ((inventory[size] ?? 0) < 1) {
  console.error("No stock for XS");
  process.exit(1);
}

inventory[size] -= 1;

try {
  const doc = await RentalReservation.create({
    userId: user._id.toString(),
    productId: "leggings",
    locationId: "asoke",
    size: "XS",
    status: "pending_pickup",
    pickupCode: "TEST01",
    price: product.pricePerRental ?? 59,
    productName: product.name ?? "leggings",
    locationName: location.name ?? "asoke",
    locationAddress: location.address ?? "",
    reservedAt: new Date(),
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
  });
  console.log("CREATE OK:", doc._id.toString());
  await RentalReservation.deleteOne({ _id: doc._id });
  console.log("Cleaned up test reservation");
} catch (error) {
  console.error("CREATE FAILED:", error);
}

await mongoose.disconnect();
