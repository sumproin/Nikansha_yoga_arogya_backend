import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Add it to your environment variables.");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}
