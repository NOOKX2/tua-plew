import "server-only";

import { unstable_cache } from "next/cache";
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
import { CATALOG_REVALIDATE_SECONDS } from "./catalog-cache";
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

type StockRow = {
  locationId: string;
  productId: string;
  inventory: SizeInventory;
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

const catalogCache = {
  revalidate: CATALOG_REVALIDATE_SECONDS,
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

function mapLocationRow(
  row: LocationRow,
  stocks: { productId: string; inventory: SizeInventory }[],
): RentalLocation {
  return {
    id: row._id,
    name: row.name,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    type: row.type as RentalLocation["type"],
    partnerName: row.partnerName ?? undefined,
    openHours: row.openHours,
    products: stocks,
  };
}

function groupStocksByLocation(
  stocks: StockRow[],
): Map<string, { productId: string; inventory: SizeInventory }[]> {
  const map = new Map<string, { productId: string; inventory: SizeInventory }[]>();
  for (const stock of stocks) {
    const list = map.get(stock.locationId) ?? [];
    list.push({
      productId: stock.productId,
      inventory: stock.inventory,
    });
    map.set(stock.locationId, list);
  }
  return map;
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

const loadProducts = unstable_cache(
  async (locale: Locale): Promise<Product[]> => {
    await connectDB();
    const rows = await ProductModel.find().sort({ _id: 1 }).lean<ProductRow[]>();
    return rows.map((row) => localizeProduct(mapProduct(row), locale));
  },
  ["catalog-products"],
  { ...catalogCache, tags: ["catalog-products"] },
);

const loadProductById = unstable_cache(
  async (id: string, locale: Locale): Promise<Product | undefined> => {
    await connectDB();
    const row = await ProductModel.findById(id).lean<ProductRow | null>();
    return row
      ? localizeProduct(mapProduct(row), locale)
      : undefined;
  },
  ["catalog-product"],
  { ...catalogCache, tags: ["catalog-products"] },
);

const loadLocations = unstable_cache(
  async (locale: Locale): Promise<RentalLocation[]> => {
    await connectDB();
    const [rows, stocks] = await Promise.all([
      RentalLocationModel.find().sort({ _id: 1 }).lean<LocationRow[]>(),
      LocationStock.find().lean<StockRow[]>(),
    ]);
    const stocksByLocation = groupStocksByLocation(stocks);
    return rows.map((row) =>
      localizeLocation(
        mapLocationRow(row, stocksByLocation.get(row._id) ?? []),
        locale,
      ),
    );
  },
  ["catalog-locations"],
  { ...catalogCache, tags: ["catalog-locations"] },
);

const loadLocationById = unstable_cache(
  async (id: string, locale: Locale): Promise<RentalLocation | undefined> => {
    await connectDB();
    const row = await RentalLocationModel.findById(id).lean<LocationRow | null>();
    if (!row) return undefined;
    const stocks = await LocationStock.find({ locationId: id }).lean<StockRow[]>();
    return localizeLocation(
      mapLocationRow(
        row,
        stocks.map((stock) => ({
          productId: stock.productId,
          inventory: stock.inventory,
        })),
      ),
      locale,
    );
  },
  ["catalog-location"],
  { ...catalogCache, tags: ["catalog-locations"] },
);

const loadCommunityEvents = unstable_cache(
  async (locale: Locale): Promise<CommunityEvent[]> => {
    await connectDB();
    const rows = await CommunityEventModel.find()
      .sort({ date: 1 })
      .lean<CommunityEventRow[]>();
    return rows.map((row) =>
      localizeCommunityEvent(mapCommunityEvent(row), locale),
    );
  },
  ["catalog-community-events"],
  { ...catalogCache, tags: ["catalog-community-events"] },
);

const loadCommunityEventById = unstable_cache(
  async (id: string, locale: Locale): Promise<CommunityEvent | undefined> => {
    await connectDB();
    const row = await CommunityEventModel.findById(id).lean<CommunityEventRow | null>();
    return row
      ? localizeCommunityEvent(mapCommunityEvent(row), locale)
      : undefined;
  },
  ["catalog-community-event"],
  { ...catalogCache, tags: ["catalog-community-events"] },
);

const loadCampaigns = unstable_cache(
  async (locale: Locale): Promise<Campaign[]> => {
    await connectDB();
    const rows = await CampaignModel.find()
      .sort({ startDate: 1 })
      .lean<CampaignRow[]>();
    return rows.map((row) =>
      localizeCampaign(mapCampaign(row), locale),
    );
  },
  ["catalog-campaigns"],
  { ...catalogCache, tags: ["catalog-campaigns"] },
);

const loadCampaignById = unstable_cache(
  async (id: string, locale: Locale): Promise<Campaign | undefined> => {
    await connectDB();
    const row = await CampaignModel.findById(id).lean<CampaignRow | null>();
    return row
      ? localizeCampaign(mapCampaign(row), locale)
      : undefined;
  },
  ["catalog-campaign"],
  { ...catalogCache, tags: ["catalog-campaigns"] },
);

export async function fetchProducts(locale?: Locale): Promise<Product[]> {
  const resolvedLocale = locale ?? (await getLocale());
  return loadProducts(resolvedLocale);
}

export async function fetchProductById(
  id: string,
  locale?: Locale,
): Promise<Product | undefined> {
  const resolvedLocale = locale ?? (await getLocale());
  return loadProductById(id, resolvedLocale);
}

export async function fetchProductIds(): Promise<string[]> {
  await connectDB();
  const rows = await ProductModel.find().select("_id").sort({ _id: 1 }).lean();
  return rows.map((row) => row._id as string);
}

export async function fetchLocations(locale?: Locale): Promise<RentalLocation[]> {
  const resolvedLocale = locale ?? (await getLocale());
  return loadLocations(resolvedLocale);
}

export async function fetchLocationById(
  id: string,
  locale?: Locale,
): Promise<RentalLocation | undefined> {
  const resolvedLocale = locale ?? (await getLocale());
  return loadLocationById(id, resolvedLocale);
}

export async function fetchCommunityEvents(
  locale?: Locale,
): Promise<CommunityEvent[]> {
  const resolvedLocale = locale ?? (await getLocale());
  return loadCommunityEvents(resolvedLocale);
}

export async function fetchCommunityEventById(
  id: string,
  locale?: Locale,
): Promise<CommunityEvent | undefined> {
  const resolvedLocale = locale ?? (await getLocale());
  return loadCommunityEventById(id, resolvedLocale);
}

export async function fetchCommunityEventIds(): Promise<string[]> {
  await connectDB();
  const rows = await CommunityEventModel.find().select("_id").sort({ _id: 1 }).lean();
  return rows.map((row) => row._id as string);
}

export async function fetchCampaigns(locale?: Locale): Promise<Campaign[]> {
  const resolvedLocale = locale ?? (await getLocale());
  return loadCampaigns(resolvedLocale);
}

export async function fetchCampaignById(
  id: string,
  locale?: Locale,
): Promise<Campaign | undefined> {
  const resolvedLocale = locale ?? (await getLocale());
  return loadCampaignById(id, resolvedLocale);
}

export async function fetchCampaignIds(): Promise<string[]> {
  await connectDB();
  const rows = await CampaignModel.find().select("_id").sort({ _id: 1 }).lean();
  return rows.map((row) => row._id as string);
}
