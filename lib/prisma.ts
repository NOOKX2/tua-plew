import "server-only";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url?.startsWith("postgresql://") && !url?.startsWith("postgres://")) {
    throw new Error(
      `DATABASE_URL must be a PostgreSQL connection string. Got: ${url ?? "(not set)"}`,
    );
  }

  return new PrismaClient({
    datasourceUrl: url,
  });
}

function getPrismaClient() {
  const cached = globalForPrisma.prisma;

  if (cached && !("rentalLocation" in cached)) {
    void (cached as PrismaClient).$disconnect();
    const client = createPrismaClient();
    globalForPrisma.prisma = client;
    return client;
  }

  if (cached) return cached;

  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrismaClient();
