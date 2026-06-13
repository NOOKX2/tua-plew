import "server-only";

import mongoose from "mongoose";

function getMongoUri() {
  const url = process.env.DATABASE_URL;
  if (
    !url?.startsWith("mongodb://") &&
    !url?.startsWith("mongodb+srv://")
  ) {
    throw new Error(
      `DATABASE_URL must be a MongoDB connection string. Got: ${url ?? "(not set)"}`,
    );
  }
  return url;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};
globalForMongoose.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri());
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
