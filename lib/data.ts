import "server-only";

import type {
  Campaign,
  CommunityEvent,
  Product,
  ProductCategory,
  RentalLocation,
  SizeGuideRow,
  SizeInventory,
  SizeUnit,
} from "./types";
import { connectDB } from "./mongoose";
import {
  Campaign as CampaignModel,
  CommunityEvent as CommunityEventModel,
  LocationStock,
  Product as ProductModel,
  RentalLocation as RentalLocationModel,
} from "./models";
import type { Locale } from "./i18n/config";
import { getLocale } from "./i18n/server";
import {
  localizeCampaign,
  localizeCommunityEvent,
  localizeLocation,
  localizeProduct,
} from "./i18n/localize-catalog";

type ProductRow = {
  _id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  image: string;
  pricePerRental: number;
  material: string;
  color: string;
  sizes: string[];
  sizeUnit: string;
  features: string[];
  activities: string[];
  sizeGuide: unknown;
  careNote: string;
  brand?: string | null;
  isPartnerBrand?: boolean | null;
};

type LocationRow = {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  partnerName?: string | null;
  openHours: string;
};

type CommunityEventRow = {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  activityType: string;
  date: string;
  startTime: string;
  endTime?: string | null;
  venue: string;
  address: string;
  locationId: string;
  organizer: string;
  participantCount: number;
  maxParticipants?: number | null;
  difficulty: string;
  tags: string[];
  recommendedProductIds: string[];
  image: string;
  featured: boolean;
};

type CampaignRow = {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  campaignType: string;
  image: string;
  discountPercent: number;
  requiredRentals?: number | null;
  partnerLocationIds: string[];
  startDate: string;
  endDate: string;
  terms: string[];
  featured: boolean;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row._id,
    name: row.name,
    description: row.description,
    longDescription: row.longDescription,
    category: row.category as ProductCategory,
    image: row.image,
    pricePerRental: row.pricePerRental,
    material: row.material,
    color: row.color,
    sizes: row.sizes,
    sizeUnit: row.sizeUnit as SizeUnit,
    features: row.features,
    activities: row.activities,
    sizeGuide: row.sizeGuide as SizeGuideRow[],
    careNote: row.careNote,
    brand: row.brand ?? undefined,
    isPartnerBrand: row.isPartnerBrand ?? undefined,
  };
}

async function mapLocation(row: LocationRow): Promise<RentalLocation> {
  const stocks = await LocationStock.find({ locationId: row._id }).lean();
  return {
    id: row._id,
    name: row.name,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    type: row.type as RentalLocation["type"],
    partnerName: row.partnerName ?? undefined,
    openHours: row.openHours,
    products: stocks.map((stock) => ({
      productId: stock.productId as string,
      inventory: stock.inventory as SizeInventory,
    })),
  };
}

function mapCommunityEvent(row: CommunityEventRow): CommunityEvent {
  return {
    id: row._id,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    activityType: row.activityType as CommunityEvent["activityType"],
    date: row.date,
    startTime: row.startTime,
    endTime: row.endTime ?? undefined,
    venue: row.venue,
    address: row.address,
    locationId: row.locationId,
    organizer: row.organizer,
    participantCount: row.participantCount,
    maxParticipants: row.maxParticipants ?? undefined,
    difficulty: row.difficulty as CommunityEvent["difficulty"],
    tags: row.tags,
    recommendedProductIds: row.recommendedProductIds,
    image: row.image,
    featured: row.featured || undefined,
  };
}

function mapCampaign(row: CampaignRow): Campaign {
  return {
    id: row._id,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    campaignType: row.campaignType as Campaign["campaignType"],
    image: row.image,
    discountPercent: row.discountPercent,
    requiredRentals: row.requiredRentals ?? undefined,
    partnerLocationIds: row.partnerLocationIds,
    startDate: row.startDate,
    endDate: row.endDate,
    terms: row.terms,
    featured: row.featured || undefined,
  };
}

export async function fetchProducts(locale?: Locale): Promise<Product[]> {
  const resolvedLocale = locale ?? (await getLocale());
  await connectDB();
  const rows = await ProductModel.find().sort({ _id: 1 }).lean<ProductRow[]>();
  return rows.map((row) => localizeProduct(mapProduct(row), resolvedLocale));
}

export async function fetchProductById(
  id: string,
  locale?: Locale,
): Promise<Product | undefined> {
  const resolvedLocale = locale ?? (await getLocale());
  await connectDB();
  const row = await ProductModel.findById(id).lean<ProductRow | null>();
  return row
    ? localizeProduct(mapProduct(row), resolvedLocale)
    : undefined;
}

export async function fetchProductIds(): Promise<string[]> {
  await connectDB();
  const rows = await ProductModel.find().select("_id").sort({ _id: 1 }).lean();
  return rows.map((row) => row._id as string);
}

export async function fetchLocations(locale?: Locale): Promise<RentalLocation[]> {
  const resolvedLocale = locale ?? (await getLocale());
  await connectDB();
  const rows = await RentalLocationModel.find()
    .sort({ _id: 1 })
    .lean<LocationRow[]>();
  const locations = await Promise.all(rows.map(mapLocation));
  return locations.map((location) =>
    localizeLocation(location, resolvedLocale),
  );
}

export async function fetchLocationById(
  id: string,
  locale?: Locale,
): Promise<RentalLocation | undefined> {
  const resolvedLocale = locale ?? (await getLocale());
  await connectDB();
  const row = await RentalLocationModel.findById(id).lean<LocationRow | null>();
  if (!row) return undefined;
  const location = await mapLocation(row);
  return localizeLocation(location, resolvedLocale);
}

export async function fetchCommunityEvents(
  locale?: Locale,
): Promise<CommunityEvent[]> {
  const resolvedLocale = locale ?? (await getLocale());
  await connectDB();
  const rows = await CommunityEventModel.find()
    .sort({ date: 1 })
    .lean<CommunityEventRow[]>();
  return rows.map((row) =>
    localizeCommunityEvent(mapCommunityEvent(row), resolvedLocale),
  );
}

export async function fetchCommunityEventById(
  id: string,
  locale?: Locale,
): Promise<CommunityEvent | undefined> {
  const resolvedLocale = locale ?? (await getLocale());
  await connectDB();
  const row = await CommunityEventModel.findById(id).lean<CommunityEventRow | null>();
  return row
    ? localizeCommunityEvent(mapCommunityEvent(row), resolvedLocale)
    : undefined;
}

export async function fetchCommunityEventIds(): Promise<string[]> {
  await connectDB();
  const rows = await CommunityEventModel.find().select("_id").sort({ _id: 1 }).lean();
  return rows.map((row) => row._id as string);
}

export async function fetchCampaigns(locale?: Locale): Promise<Campaign[]> {
  const resolvedLocale = locale ?? (await getLocale());
  await connectDB();
  const rows = await CampaignModel.find()
    .sort({ startDate: 1 })
    .lean<CampaignRow[]>();
  return rows.map((row) =>
    localizeCampaign(mapCampaign(row), resolvedLocale),
  );
}

export async function fetchCampaignById(
  id: string,
  locale?: Locale,
): Promise<Campaign | undefined> {
  const resolvedLocale = locale ?? (await getLocale());
  await connectDB();
  const row = await CampaignModel.findById(id).lean<CampaignRow | null>();
  return row
    ? localizeCampaign(mapCampaign(row), resolvedLocale)
    : undefined;
}

export async function fetchCampaignIds(): Promise<string[]> {
  await connectDB();
  const rows = await CampaignModel.find().select("_id").sort({ _id: 1 }).lean();
  return rows.map((row) => row._id as string);
}
