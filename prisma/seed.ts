import { PrismaClient } from "@prisma/client";
import { campaigns } from "./seed-campaigns";
import { communityEvents } from "./seed-community";
import { rentalLocations } from "./seed-locations";
import { products } from "./seed-products";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding catalog data...");

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
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
      },
      update: {
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
      },
    });
  }

  for (const location of rentalLocations) {
    await prisma.rentalLocation.upsert({
      where: { id: location.id },
      create: {
        id: location.id,
        name: location.name,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        type: location.type,
        partnerName: location.partnerName,
        openHours: location.openHours,
      },
      update: {
        name: location.name,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        type: location.type,
        partnerName: location.partnerName,
        openHours: location.openHours,
      },
    });

    for (const stock of location.products) {
      await prisma.locationStock.upsert({
        where: {
          locationId_productId: {
            locationId: location.id,
            productId: stock.productId,
          },
        },
        create: {
          locationId: location.id,
          productId: stock.productId,
          inventory: stock.inventory,
        },
        update: {
          inventory: stock.inventory,
        },
      });
    }
  }

  for (const event of communityEvents) {
    await prisma.communityEvent.upsert({
      where: { id: event.id },
      create: {
        id: event.id,
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
      update: {
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
    });
  }

  for (const campaign of campaigns) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      create: {
        id: campaign.id,
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
      },
      update: {
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
      },
    });
  }

  console.log(
    `Seeded ${products.length} products, ${rentalLocations.length} locations, ${communityEvents.length} events, ${campaigns.length} campaigns`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
