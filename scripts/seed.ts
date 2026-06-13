import mongoose from "mongoose";
import { campaigns } from "../seed/seed-campaigns";
import { communityEvents } from "../seed/seed-community";
import { rentalLocations } from "../seed/seed-locations";
import { products } from "../seed/seed-products";
import {
  Campaign,
  CommunityEvent,
  LocationStock,
  Product,
  RentalLocation,
} from "../lib/models";

const url = process.env.DATABASE_URL;
if (
  !url?.startsWith("mongodb://") &&
  !url?.startsWith("mongodb+srv://")
) {
  throw new Error("DATABASE_URL must be a MongoDB connection string");
}

const databaseUrl = url;

async function main() {
  await mongoose.connect(databaseUrl);

  console.log("Seeding catalog data...");

  for (const product of products) {
    await Product.findByIdAndUpdate(
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
      },
      { upsert: true, new: true },
    );
  }

  for (const location of rentalLocations) {
    await RentalLocation.findByIdAndUpdate(
      location.id,
      {
        _id: location.id,
        name: location.name,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        type: location.type,
        partnerName: location.partnerName,
        openHours: location.openHours,
      },
      { upsert: true, new: true },
    );

    for (const stock of location.products) {
      await LocationStock.findOneAndUpdate(
        { locationId: location.id, productId: stock.productId },
        {
          locationId: location.id,
          productId: stock.productId,
          inventory: stock.inventory,
        },
        { upsert: true, new: true },
      );
    }
  }

  for (const event of communityEvents) {
    await CommunityEvent.findByIdAndUpdate(
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
  }

  for (const campaign of campaigns) {
    await Campaign.findByIdAndUpdate(
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
      },
      { upsert: true, new: true },
    );
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
  .finally(() => mongoose.disconnect());
