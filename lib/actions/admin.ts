"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminUser } from "@/lib/user-role.server";
import {
  deleteAdminCampaign,
  deleteAdminEvent,
  deleteAdminProduct,
  saveAdminCampaign,
  saveAdminEvent,
  saveAdminProduct,
} from "@/lib/admin/catalog.server";
import {
  commaFromArray,
  jsonFromArray,
  linesFromArray,
  parseCommaList,
  parseJsonArray,
  parseLines,
  parseOptionalNumber,
  parseRequiredNumber,
  parseSlug,
} from "@/lib/admin/parse-form";
import type {
  CampaignType,
  CommunityActivityType,
  CommunityDifficulty,
  ProductCategory,
  SizeGuideRow,
  SizeUnit,
} from "@/lib/types";
import { auth } from "@/auth";
import type { ActionResult } from "./types";

async function assertAdmin(): Promise<ActionResult<{ userId: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "กรุณาเข้าสู่ระบบ" };
  }
  if (!(await isAdminUser(session.user.id, session.user.email))) {
    return { ok: false, error: "ไม่มีสิทธิ์เข้าถึง" };
  }
  return { ok: true, data: { userId: session.user.id } };
}

function revalidateCatalog(...tags: string[]) {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function formCheckbox(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

export async function saveProductAdminAction(
  formData: FormData,
): Promise<ActionResult> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;

  const isNew = formData.get("isNew") === "true";
  const id = parseSlug(formString(formData, "id"));
  if (!id) return { ok: false, error: "รหัสสินค้าไม่ถูกต้อง (ใช้ a-z, 0-9, - เท่านั้น)" };

  const pricePerRental = parseRequiredNumber(formString(formData, "pricePerRental"));
  if (pricePerRental === null || pricePerRental < 0) {
    return { ok: false, error: "ราคาเช่าไม่ถูกต้อง" };
  }

  const category = formString(formData, "category") as ProductCategory;
  if (!["top", "bottom", "set", "shoe"].includes(category)) {
    return { ok: false, error: "หมวดหมู่ไม่ถูกต้อง" };
  }

  const sizeUnit = formString(formData, "sizeUnit") as SizeUnit;
  if (sizeUnit !== "ตัว" && sizeUnit !== "คู่") {
    return { ok: false, error: "หน่วยขนาดไม่ถูกต้อง" };
  }

  const sizes = parseCommaList(formString(formData, "sizes"));
  if (sizes.length === 0) return { ok: false, error: "กรุณาระบุขนาดอย่างน้อย 1 รายการ" };

  const sizeGuide = parseJsonArray<SizeGuideRow>(formString(formData, "sizeGuide"));
  if (sizeGuide === null) return { ok: false, error: "ตารางไซส์ต้องเป็น JSON array" };

  const name = formString(formData, "name").trim();
  const description = formString(formData, "description").trim();
  const longDescription = formString(formData, "longDescription").trim();
  const image = formString(formData, "image").trim();
  const material = formString(formData, "material").trim();
  const color = formString(formData, "color").trim();
  const careNote = formString(formData, "careNote").trim();

  if (!name || !description || !longDescription || !image || !material || !color || !careNote) {
    return { ok: false, error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ" };
  }

  const brand = formString(formData, "brand").trim();

  await saveAdminProduct({
    id,
    name,
    description,
    longDescription,
    category,
    image,
    pricePerRental,
    material,
    color,
    sizes,
    sizeUnit,
    features: parseLines(formString(formData, "features")),
    activities: parseLines(formString(formData, "activities")),
    sizeGuide,
    careNote,
    brand: brand || undefined,
    isPartnerBrand: formCheckbox(formData, "isPartnerBrand"),
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/rentals/shop");
  revalidatePath("/");
  revalidateCatalog("catalog-products", "catalog-locations");

  if (isNew) redirect(`/admin/products/${id}`);
  return { ok: true, data: undefined };
}

export async function deleteProductAdminAction(
  productId: string,
): Promise<ActionResult> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;

  const deleted = await deleteAdminProduct(productId);
  if (!deleted) return { ok: false, error: "ไม่พบสินค้า" };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/rentals/shop");
  revalidatePath("/");
  revalidateCatalog("catalog-products", "catalog-locations");
  redirect("/admin/products");
}

export async function saveEventAdminAction(
  formData: FormData,
): Promise<ActionResult> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;

  const isNew = formData.get("isNew") === "true";
  const id = parseSlug(formString(formData, "id"));
  if (!id) return { ok: false, error: "รหัสกิจกรรมไม่ถูกต้อง" };

  const activityType = formString(formData, "activityType") as CommunityActivityType;
  const difficulty = formString(formData, "difficulty") as CommunityDifficulty;

  const participantCount = parseRequiredNumber(formString(formData, "participantCount"));
  if (participantCount === null || participantCount < 0) {
    return { ok: false, error: "จำนวนผู้เข้าร่วมไม่ถูกต้อง" };
  }

  const title = formString(formData, "title").trim();
  const shortDescription = formString(formData, "shortDescription").trim();
  const description = formString(formData, "description").trim();
  const date = formString(formData, "date").trim();
  const startTime = formString(formData, "startTime").trim();
  const venue = formString(formData, "venue").trim();
  const address = formString(formData, "address").trim();
  const locationId = formString(formData, "locationId").trim();
  const organizer = formString(formData, "organizer").trim();
  const image = formString(formData, "image").trim();

  if (
    !title ||
    !shortDescription ||
    !description ||
    !date ||
    !startTime ||
    !venue ||
    !address ||
    !locationId ||
    !organizer ||
    !image
  ) {
    return { ok: false, error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ" };
  }

  const endTime = formString(formData, "endTime").trim();

  await saveAdminEvent({
    id,
    title,
    shortDescription,
    description,
    activityType,
    date,
    startTime,
    endTime: endTime || undefined,
    venue,
    address,
    locationId,
    organizer,
    participantCount,
    maxParticipants: parseOptionalNumber(formString(formData, "maxParticipants")),
    difficulty,
    tags: parseLines(formString(formData, "tags")),
    recommendedProductIds: parseCommaList(
      formString(formData, "recommendedProductIds"),
    ),
    image,
    featured: formCheckbox(formData, "featured"),
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/community");
  revalidatePath(`/community/${id}`);
  revalidatePath("/");
  revalidateCatalog("catalog-community-events");

  if (isNew) redirect(`/admin/events/${id}`);
  return { ok: true, data: undefined };
}

export async function deleteEventAdminAction(
  eventId: string,
): Promise<ActionResult> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;

  const deleted = await deleteAdminEvent(eventId);
  if (!deleted) return { ok: false, error: "ไม่พบกิจกรรม" };

  revalidatePath("/admin/events");
  revalidatePath("/community");
  revalidatePath("/");
  revalidateCatalog("catalog-community-events");
  redirect("/admin/events");
}

export async function saveCampaignAdminAction(
  formData: FormData,
): Promise<ActionResult> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;

  const isNew = formData.get("isNew") === "true";
  const id = parseSlug(formString(formData, "id"));
  if (!id) return { ok: false, error: "รหัสแคมเปญไม่ถูกต้อง" };

  const campaignType = formString(formData, "campaignType") as CampaignType;
  const discountPercent = parseRequiredNumber(formString(formData, "discountPercent"));
  if (discountPercent === null || discountPercent < 0) {
    return { ok: false, error: "ส่วนลดไม่ถูกต้อง" };
  }

  const title = formString(formData, "title").trim();
  const shortDescription = formString(formData, "shortDescription").trim();
  const description = formString(formData, "description").trim();
  const image = formString(formData, "image").trim();
  const startDate = formString(formData, "startDate").trim();
  const endDate = formString(formData, "endDate").trim();

  if (!title || !shortDescription || !description || !image || !startDate || !endDate) {
    return { ok: false, error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ" };
  }

  const rewardLabel = formString(formData, "rewardLabel").trim();
  const howToClaimSteps = parseLines(formString(formData, "howToClaimSteps"));

  await saveAdminCampaign({
    id,
    title,
    shortDescription,
    description,
    campaignType,
    image,
    discountPercent,
    requiredRentals: parseOptionalNumber(formString(formData, "requiredRentals")),
    partnerLocationIds: parseCommaList(formString(formData, "partnerLocationIds")),
    startDate,
    endDate,
    terms: parseLines(formString(formData, "terms")),
    featured: formCheckbox(formData, "featured"),
    rewardLabel: rewardLabel || undefined,
    howToClaimSteps: howToClaimSteps.length > 0 ? howToClaimSteps : undefined,
  });

  revalidatePath("/admin/campaigns");
  revalidatePath(`/admin/campaigns/${id}`);
  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${id}`);
  revalidateCatalog("catalog-campaigns");

  if (isNew) redirect(`/admin/campaigns/${id}`);
  return { ok: true, data: undefined };
}

export async function deleteCampaignAdminAction(
  campaignId: string,
): Promise<ActionResult> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;

  const deleted = await deleteAdminCampaign(campaignId);
  if (!deleted) return { ok: false, error: "ไม่พบแคมเปญ" };

  revalidatePath("/admin/campaigns");
  revalidatePath("/campaigns");
  revalidateCatalog("catalog-campaigns");
  redirect("/admin/campaigns");
}

// Re-export helpers for form default values in server components
export {
  commaFromArray,
  jsonFromArray,
  linesFromArray,
};
