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
import { prisma } from "./prisma";

type DbProduct = {
  id: string;
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
};

type DbLocationWithStocks = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  partnerName: string | null;
  openHours: string;
  stocks: {
    productId: string;
    inventory: unknown;
  }[];
};

function mapProduct(row: DbProduct): Product {
  return {
    id: row.id,
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
  };
}

function mapLocation(row: DbLocationWithStocks): RentalLocation {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    type: row.type as RentalLocation["type"],
    partnerName: row.partnerName ?? undefined,
    openHours: row.openHours,
    products: row.stocks.map((stock) => ({
      productId: stock.productId,
      inventory: stock.inventory as SizeInventory,
    })),
  };
}

function mapCommunityEvent(row: {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  activityType: string;
  date: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  address: string;
  locationId: string;
  organizer: string;
  participantCount: number;
  maxParticipants: number | null;
  difficulty: string;
  tags: string[];
  recommendedProductIds: string[];
  image: string;
  featured: boolean;
}): CommunityEvent {
  return {
    id: row.id,
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

function mapCampaign(row: {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  campaignType: string;
  image: string;
  discountPercent: number;
  requiredRentals: number | null;
  partnerLocationIds: string[];
  startDate: string;
  endDate: string;
  terms: string[];
  featured: boolean;
}): Campaign {
  return {
    id: row.id,
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

export async function fetchProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { id: "asc" } });
  return rows.map(mapProduct);
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? mapProduct(row) : undefined;
}

export async function fetchProductIds(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });
  return rows.map((row) => row.id);
}

export async function fetchLocations(): Promise<RentalLocation[]> {
  const rows = await prisma.rentalLocation.findMany({
    include: { stocks: true },
    orderBy: { id: "asc" },
  });
  return rows.map(mapLocation);
}

export async function fetchLocationById(
  id: string,
): Promise<RentalLocation | undefined> {
  const row = await prisma.rentalLocation.findUnique({
    where: { id },
    include: { stocks: true },
  });
  return row ? mapLocation(row) : undefined;
}

export async function fetchCommunityEvents(): Promise<CommunityEvent[]> {
  const rows = await prisma.communityEvent.findMany({ orderBy: { date: "asc" } });
  return rows.map(mapCommunityEvent);
}

export async function fetchCommunityEventById(
  id: string,
): Promise<CommunityEvent | undefined> {
  const row = await prisma.communityEvent.findUnique({ where: { id } });
  return row ? mapCommunityEvent(row) : undefined;
}

export async function fetchCommunityEventIds(): Promise<string[]> {
  const rows = await prisma.communityEvent.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });
  return rows.map((row) => row.id);
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const rows = await prisma.campaign.findMany({ orderBy: { startDate: "asc" } });
  return rows.map(mapCampaign);
}

export async function fetchCampaignById(
  id: string,
): Promise<Campaign | undefined> {
  const row = await prisma.campaign.findUnique({ where: { id } });
  return row ? mapCampaign(row) : undefined;
}

export async function fetchCampaignIds(): Promise<string[]> {
  const rows = await prisma.campaign.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });
  return rows.map((row) => row.id);
}
