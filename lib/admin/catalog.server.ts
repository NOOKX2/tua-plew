import "server-only";

import { updateTag } from "next/cache";
import { connectDB } from "@/lib/mongoose";
import {
  Campaign as CampaignModel,
  CommunityEvent as CommunityEventModel,
  Product as ProductModel,
} from "@/lib/models";
import type {
  Campaign,
  CampaignType,
  CommunityActivityType,
  CommunityDifficulty,
  CommunityEvent,
  Product,
  ProductCategory,
  SizeGuideRow,
  SizeUnit,
} from "@/lib/types";

export function revalidateCatalogTags() {
  updateTag("catalog-products");
  updateTag("catalog-community-events");
  updateTag("catalog-campaigns");
}

export async function listAdminProducts(): Promise<Product[]> {
  await connectDB();
  const rows = await ProductModel.find().sort({ _id: 1 }).lean();
  return rows.map((row) => ({
    id: row._id as string,
    name: row.name as string,
    description: row.description as string,
    longDescription: row.longDescription as string,
    category: row.category as ProductCategory,
    image: row.image as string,
    pricePerRental: row.pricePerRental as number,
    material: row.material as string,
    color: row.color as string,
    sizes: row.sizes as string[],
    sizeUnit: row.sizeUnit as SizeUnit,
    features: row.features as string[],
    activities: row.activities as string[],
    sizeGuide: row.sizeGuide as SizeGuideRow[],
    careNote: row.careNote as string,
    brand: (row.brand as string | undefined) ?? undefined,
    isPartnerBrand: (row.isPartnerBrand as boolean | undefined) ?? undefined,
  }));
}

export async function getAdminProduct(id: string): Promise<Product | null> {
  await connectDB();
  const row = await ProductModel.findById(id).lean();
  if (!row) return null;
  return {
    id: row._id as string,
    name: row.name as string,
    description: row.description as string,
    longDescription: row.longDescription as string,
    category: row.category as ProductCategory,
    image: row.image as string,
    pricePerRental: row.pricePerRental as number,
    material: row.material as string,
    color: row.color as string,
    sizes: row.sizes as string[],
    sizeUnit: row.sizeUnit as SizeUnit,
    features: row.features as string[],
    activities: row.activities as string[],
    sizeGuide: row.sizeGuide as SizeGuideRow[],
    careNote: row.careNote as string,
    brand: (row.brand as string | undefined) ?? undefined,
    isPartnerBrand: (row.isPartnerBrand as boolean | undefined) ?? undefined,
  };
}

export async function saveAdminProduct(product: Product): Promise<void> {
  await connectDB();
  await ProductModel.findByIdAndUpdate(
    product.id,
    {
      _id: product.id,
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      category: product.category,
      image: product.image,
      pricePerRental: product.pricePerRental,
      material: product.material,
      color: product.color,
      sizes: product.sizes,
      sizeUnit: product.sizeUnit,
      features: product.features,
      activities: product.activities,
      sizeGuide: product.sizeGuide,
      careNote: product.careNote,
      brand: product.brand,
      isPartnerBrand: product.isPartnerBrand ?? false,
    },
    { upsert: true, new: true },
  );
  updateTag("catalog-products");
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  await connectDB();
  const result = await ProductModel.findByIdAndDelete(id);
  if (result) updateTag("catalog-products");
  return Boolean(result);
}

export async function listAdminEvents(): Promise<CommunityEvent[]> {
  await connectDB();
  const rows = await CommunityEventModel.find().sort({ date: -1 }).lean();
  return rows.map((row) => ({
    id: row._id as string,
    title: row.title as string,
    shortDescription: row.shortDescription as string,
    description: row.description as string,
    activityType: row.activityType as CommunityActivityType,
    date: row.date as string,
    startTime: row.startTime as string,
    endTime: (row.endTime as string | undefined) ?? undefined,
    venue: row.venue as string,
    address: row.address as string,
    locationId: row.locationId as string,
    organizer: row.organizer as string,
    participantCount: row.participantCount as number,
    maxParticipants: (row.maxParticipants as number | undefined) ?? undefined,
    difficulty: row.difficulty as CommunityDifficulty,
    tags: row.tags as string[],
    recommendedProductIds: row.recommendedProductIds as string[],
    image: row.image as string,
    featured: (row.featured as boolean | undefined) || undefined,
  }));
}

export async function getAdminEvent(id: string): Promise<CommunityEvent | null> {
  await connectDB();
  const row = await CommunityEventModel.findById(id).lean();
  if (!row) return null;
  return {
    id: row._id as string,
    title: row.title as string,
    shortDescription: row.shortDescription as string,
    description: row.description as string,
    activityType: row.activityType as CommunityActivityType,
    date: row.date as string,
    startTime: row.startTime as string,
    endTime: (row.endTime as string | undefined) ?? undefined,
    venue: row.venue as string,
    address: row.address as string,
    locationId: row.locationId as string,
    organizer: row.organizer as string,
    participantCount: row.participantCount as number,
    maxParticipants: (row.maxParticipants as number | undefined) ?? undefined,
    difficulty: row.difficulty as CommunityDifficulty,
    tags: row.tags as string[],
    recommendedProductIds: row.recommendedProductIds as string[],
    image: row.image as string,
    featured: (row.featured as boolean | undefined) || undefined,
  };
}

export async function saveAdminEvent(event: CommunityEvent): Promise<void> {
  await connectDB();
  await CommunityEventModel.findByIdAndUpdate(
    event.id,
    {
      _id: event.id,
      title: event.title,
      shortDescription: event.shortDescription,
      description: event.description,
      activityType: event.activityType,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
      address: event.address,
      locationId: event.locationId,
      organizer: event.organizer,
      participantCount: event.participantCount,
      maxParticipants: event.maxParticipants,
      difficulty: event.difficulty,
      tags: event.tags,
      recommendedProductIds: event.recommendedProductIds,
      image: event.image,
      featured: event.featured ?? false,
    },
    { upsert: true, new: true },
  );
  updateTag("catalog-community-events");
}

export async function deleteAdminEvent(id: string): Promise<boolean> {
  await connectDB();
  const result = await CommunityEventModel.findByIdAndDelete(id);
  if (result) updateTag("catalog-community-events");
  return Boolean(result);
}

export async function listAdminCampaigns(): Promise<Campaign[]> {
  await connectDB();
  const rows = await CampaignModel.find().sort({ startDate: -1 }).lean();
  return rows.map((row) => ({
    id: row._id as string,
    title: row.title as string,
    shortDescription: row.shortDescription as string,
    description: row.description as string,
    campaignType: row.campaignType as CampaignType,
    image: row.image as string,
    discountPercent: row.discountPercent as number,
    requiredRentals: (row.requiredRentals as number | undefined) ?? undefined,
    partnerLocationIds: row.partnerLocationIds as string[],
    startDate: row.startDate as string,
    endDate: row.endDate as string,
    terms: row.terms as string[],
    featured: (row.featured as boolean | undefined) || undefined,
    rewardLabel: (row.rewardLabel as string | undefined) ?? undefined,
    howToClaimSteps: (row.howToClaimSteps as string[] | undefined) ?? undefined,
  }));
}

export async function getAdminCampaign(id: string): Promise<Campaign | null> {
  await connectDB();
  const row = await CampaignModel.findById(id).lean();
  if (!row) return null;
  return {
    id: row._id as string,
    title: row.title as string,
    shortDescription: row.shortDescription as string,
    description: row.description as string,
    campaignType: row.campaignType as CampaignType,
    image: row.image as string,
    discountPercent: row.discountPercent as number,
    requiredRentals: (row.requiredRentals as number | undefined) ?? undefined,
    partnerLocationIds: row.partnerLocationIds as string[],
    startDate: row.startDate as string,
    endDate: row.endDate as string,
    terms: row.terms as string[],
    featured: (row.featured as boolean | undefined) || undefined,
    rewardLabel: (row.rewardLabel as string | undefined) ?? undefined,
    howToClaimSteps: (row.howToClaimSteps as string[] | undefined) ?? undefined,
  };
}

export async function saveAdminCampaign(campaign: Campaign): Promise<void> {
  await connectDB();
  await CampaignModel.findByIdAndUpdate(
    campaign.id,
    {
      _id: campaign.id,
      title: campaign.title,
      shortDescription: campaign.shortDescription,
      description: campaign.description,
      campaignType: campaign.campaignType,
      image: campaign.image,
      discountPercent: campaign.discountPercent,
      requiredRentals: campaign.requiredRentals,
      partnerLocationIds: campaign.partnerLocationIds,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      terms: campaign.terms,
      featured: campaign.featured ?? false,
      rewardLabel: campaign.rewardLabel,
      howToClaimSteps: campaign.howToClaimSteps,
    },
    { upsert: true, new: true },
  );
  updateTag("catalog-campaigns");
}

export async function deleteAdminCampaign(id: string): Promise<boolean> {
  await connectDB();
  const result = await CampaignModel.findByIdAndDelete(id);
  if (result) updateTag("catalog-campaigns");
  return Boolean(result);
}
