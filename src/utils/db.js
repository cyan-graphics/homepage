import mongoose from "mongoose";

const globalCache = globalThis;
const cached = globalCache.mongooseConnection || { connection: null, promise: null };
globalCache.mongooseConnection = cached;

export default async function connect() {
  const uri = process.env.MONGODB_URI || process.env.MONGO;

  if (!uri) {
    const error = new Error(
      "MongoDB is not configured. Add MONGODB_URI to .env.local and restart the server."
    );
    error.code = "MONGODB_NOT_CONFIGURED";
    throw error;
  }

  if (cached.connection) return cached.connection;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  try {
    cached.connection = await cached.promise;
    return cached.connection;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
