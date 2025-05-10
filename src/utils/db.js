import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in .env.local');

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  console.log("Connecting to MongoDB...");
  if (cached.conn) return cached.conn;
  console.log("MongoDB connection not found, creating a new one...");
  cached.promise = cached.promise || 
    mongoose.connect(MONGODB_URI).then(mongoose => mongoose);

  console.log("MongoDB connected successfully");

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;