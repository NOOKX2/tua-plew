import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    pricePerRental: { type: Number, required: true },
    material: { type: String, required: true },
    color: { type: String, required: true },
    sizes: { type: [String], required: true },
    sizeUnit: { type: String, required: true },
    features: { type: [String], required: true },
    activities: { type: [String], required: true },
    sizeGuide: { type: Schema.Types.Mixed, required: true },
    careNote: { type: String, required: true },
  },
  { timestamps: true, _id: false },
);

const rentalLocationSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    type: { type: String, required: true },
    partnerName: { type: String },
    openHours: { type: String, required: true },
  },
  { timestamps: true, _id: false },
);

const locationStockSchema = new Schema(
  {
    locationId: { type: String, required: true },
    productId: { type: String, required: true },
    inventory: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: false },
);
locationStockSchema.index({ locationId: 1, productId: 1 }, { unique: true });

const communityEventSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    activityType: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
    venue: { type: String, required: true },
    address: { type: String, required: true },
    locationId: { type: String, required: true },
    organizer: { type: String, required: true },
    participantCount: { type: Number, required: true },
    maxParticipants: { type: Number },
    difficulty: { type: String, required: true },
    tags: { type: [String], required: true },
    recommendedProductIds: { type: [String], required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, _id: false },
);

const campaignSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    campaignType: { type: String, required: true },
    image: { type: String, required: true },
    discountPercent: { type: Number, required: true },
    requiredRentals: { type: Number },
    partnerLocationIds: { type: [String], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    terms: { type: [String], required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, _id: false },
);

const campaignEnrollmentSchema = new Schema(
  {
    userId: { type: String, required: true },
    campaignId: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
campaignEnrollmentSchema.index({ userId: 1, campaignId: 1 }, { unique: true });
campaignEnrollmentSchema.index({ campaignId: 1 });

const communityEnrollmentSchema = new Schema(
  {
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
communityEnrollmentSchema.index({ userId: 1, eventId: 1 }, { unique: true });
communityEnrollmentSchema.index({ eventId: 1 });

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Date },
    image: { type: String },
    passwordHash: { type: String },
  },
  { timestamps: true },
);

const accountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    refresh_token: { type: String },
    access_token: { type: String },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
    id_token: { type: String },
    session_state: { type: String },
  },
  { timestamps: false },
);
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

function getModel(name: string, schema: Schema, collection: string) {
  return mongoose.models[name] ?? mongoose.model(name, schema, collection);
}

export const Product = getModel("Product", productSchema, "Product");
export const RentalLocation = getModel(
  "RentalLocation",
  rentalLocationSchema,
  "RentalLocation",
);
export const LocationStock = getModel(
  "LocationStock",
  locationStockSchema,
  "LocationStock",
);
export const CommunityEvent = getModel(
  "CommunityEvent",
  communityEventSchema,
  "CommunityEvent",
);
export const Campaign = getModel("Campaign", campaignSchema, "Campaign");
export const CampaignEnrollment = getModel(
  "CampaignEnrollment",
  campaignEnrollmentSchema,
  "CampaignEnrollment",
);
export const CommunityEnrollment = getModel(
  "CommunityEnrollment",
  communityEnrollmentSchema,
  "CommunityEnrollment",
);
export const User = getModel("User", userSchema, "User");
export const Account = getModel("Account", accountSchema, "Account");
