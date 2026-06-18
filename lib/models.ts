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
    brand: { type: String },
    isPartnerBrand: { type: Boolean, default: false },
  },
  { timestamps: true, _id: false },
);

const reviewSchema = new Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    userName: { type: String, required: true },
    userImage: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
reviewSchema.index({ productId: 1, createdAt: -1 });

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
    rewardLabel: { type: String },
    howToClaimSteps: { type: [String] },
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

const rentalReservationSchema = new Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    locationId: { type: String, required: true },
    size: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending_pickup", "picked_up", "returned", "cancelled", "expired"],
    },
    pickupCode: { type: String, required: true },
    price: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "tokens", "mixed", "subscription"],
      default: "cash",
    },
    tokensSpent: { type: Number, default: 0 },
    productName: { type: String, required: true },
    locationName: { type: String, required: true },
    locationAddress: { type: String, required: true },
    reservedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    pickedUpAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true },
);
rentalReservationSchema.index({ pickupCode: 1 }, { unique: true });
rentalReservationSchema.index({ userId: 1, status: 1 });
rentalReservationSchema.index({ expiresAt: 1 });

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Date },
    image: { type: String },
    passwordHash: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    rentalTokenBalance: { type: Number, default: 0, min: 0 },
    subscriptionPlan: {
      type: String,
      enum: ["basic", "standard", "premium"],
    },
    subscriptionPeriodStart: { type: Date, default: null },
    subscriptionRentalsUsed: { type: Number, default: 0, min: 0 },
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

const friendshipSchema = new Schema(
  {
    requesterId: { type: String, required: true },
    addresseeId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true },
);
friendshipSchema.index({ requesterId: 1, addresseeId: 1 }, { unique: true });
friendshipSchema.index({ addresseeId: 1, status: 1 });
friendshipSchema.index({ requesterId: 1, status: 1 });

const eventChatMessageSchema = new Schema(
  {
    eventId: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderImage: { type: String },
    body: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true },
);
eventChatMessageSchema.index({ eventId: 1, createdAt: -1 });

const directConversationSchema = new Schema(
  {
    participantKey: { type: String, required: true, unique: true },
    participantIds: { type: [String], required: true },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessagePreview: { type: String, default: "" },
  },
  { timestamps: true },
);
directConversationSchema.index({ participantIds: 1 });
directConversationSchema.index({ lastMessageAt: -1 });

const directMessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "DirectConversation",
      required: true,
    },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderImage: { type: String },
    body: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true },
);
directMessageSchema.index({ conversationId: 1, createdAt: -1 });

const rentalTokenTransactionSchema = new Schema(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      enum: ["welcome", "spend", "refund", "earn", "topup"],
    },
    rentalId: { type: String },
    description: { type: String },
  },
  { timestamps: true },
);
rentalTokenTransactionSchema.index({ userId: 1, createdAt: -1 });

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
export const Review = getModel("Review", reviewSchema, "Review");
export const RentalReservation = getModel(
  "RentalReservation",
  rentalReservationSchema,
  "RentalReservation",
);
export const User = getModel("User", userSchema, "User");
export const Account = getModel("Account", accountSchema, "Account");
export const Friendship = getModel("Friendship", friendshipSchema, "Friendship");
export const EventChatMessage = getModel(
  "EventChatMessage",
  eventChatMessageSchema,
  "EventChatMessage",
);
export const DirectConversation = getModel(
  "DirectConversation",
  directConversationSchema,
  "DirectConversation",
);
export const DirectMessage = getModel(
  "DirectMessage",
  directMessageSchema,
  "DirectMessage",
);
export const RentalTokenTransaction = getModel(
  "RentalTokenTransaction",
  rentalTokenTransactionSchema,
  "RentalTokenTransaction",
);
