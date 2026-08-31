import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGO_URI ?? process.env.mongo_uri ?? "";

if (!MONGODB_URI) {
  console.warn(
    "[db] MONGO_URI is not set. Database features will be unavailable until it is configured."
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}
const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};
globalThis.mongooseCache = cached;

export async function connectDb(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) {
    throw new Error(
      "MongoDB connection string is missing. Set MONGO_URI (or mongo_uri) in your environment."
    );
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
