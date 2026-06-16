export type ApparelSize = "XS" | "S" | "M" | "L" | "XL";

export type SizeInventory = Record<string, number>;

export type ProductCategory = "top" | "bottom" | "set" | "shoe";

export type SizeUnit = "ตัว" | "คู่";

export type SizeGuideRow = {
  size: string;
  chest?: string;
  waist?: string;
  footLength?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: ProductCategory;
  image: string;
  pricePerRental: number;
  material: string;
  color: string;
  sizes: string[];
  sizeUnit: SizeUnit;
  features: string[];
  activities: string[];
  sizeGuide: SizeGuideRow[];
  careNote: string;
  brand?: string;
  isPartnerBrand?: boolean;
};

export type ProductReview = {
  id: string;
  userId: string;
  productId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ProductRatingSummary = {
  averageRating: number;
  count: number;
};

export type RentalStatus =
  | "pending_pickup"
  | "picked_up"
  | "returned"
  | "cancelled"
  | "expired";

export type RentalReservation = {
  id: string;
  userId: string;
  productId: string;
  locationId: string;
  size: string;
  status: RentalStatus;
  pickupCode: string;
  price: number;
  productName: string;
  locationName: string;
  locationAddress: string;
  reservedAt: string;
  expiresAt: string;
  pickedUpAt?: string;
  cancelledAt?: string;
};

export type LocationProductStock = {
  productId: string;
  inventory: SizeInventory;
};

export type RentalLocation = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "booth" | "qr" | "partner";
  partnerName?: string;
  openHours: string;
  products: LocationProductStock[];
};

export const APPAREL_SIZES: ApparelSize[] = ["XS", "S", "M", "L", "XL"];

export const SHOE_SIZES = ["38", "39", "40", "41", "42", "43"] as const;

/** @deprecated use APPAREL_SIZES */
export const SHIRT_SIZES = APPAREL_SIZES;

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  top: "เสื้อ",
  bottom: "กางเกง",
  set: "ชุด",
  shoe: "รองเท้า",
};

export type CommunityActivityType =
  | "run-club"
  | "hyrox"
  | "yoga"
  | "crossfit"
  | "cycling"
  | "swim"
  | "pilates"
  | "hiking";

export type CommunityDifficulty = "beginner" | "intermediate" | "advanced";

export type CommunityEvent = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  activityType: CommunityActivityType;
  date: string;
  startTime: string;
  endTime?: string;
  venue: string;
  address: string;
  locationId: string;
  organizer: string;
  participantCount: number;
  maxParticipants?: number;
  difficulty: CommunityDifficulty;
  tags: string[];
  recommendedProductIds: string[];
  image: string;
  featured?: boolean;
};

export type EventJoinPerkCategory = "rental" | "food" | "coffee" | "gaming";

export type EventJoinPerk = {
  id: string;
  category: EventJoinPerkCategory;
  partnerName: string;
  title: string;
  description: string;
  code: string;
  validUntil?: string;
  highlight?: boolean;
};

export type CampaignType = "loyalty" | "first-time" | "bundle" | "seasonal";

export type Campaign = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  campaignType: CampaignType;
  image: string;
  discountPercent: number;
  requiredRentals?: number;
  partnerLocationIds: string[];
  startDate: string;
  endDate: string;
  terms: string[];
  featured?: boolean;
};

export type CampaignProgress = {
  current: number;
  target: number;
  percent: number;
  complete: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type FriendshipStatus = "pending" | "accepted" | "blocked";

export type FriendshipView = {
  id: string;
  user: UserProfile;
  status: FriendshipStatus;
  direction: "incoming" | "outgoing" | "friend";
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  body: string;
  createdAt: string;
};

export type DirectConversationSummary = {
  id: string;
  otherUser: UserProfile;
  lastMessage?: string;
  lastMessageAt?: string;
};

export type ChatInboxKind = "direct" | "event";

export type ChatInboxItem = {
  id: string;
  kind: ChatInboxKind;
  title: string;
  image?: string;
  lastMessage?: string;
  lastMessageAt: string;
  href: string;
};

export type EventParticipant = UserProfile & {
  isFriend: boolean;
  friendshipStatus?: FriendshipStatus;
};
