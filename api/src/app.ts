import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import scheduleRoutes from "./routes/schedule";
import testimonialRoutes from "./routes/testimonials";
import adminRoutes from "./routes/admin";
import { ScheduleEntryModel } from "./models/ScheduleEntry";
import { defaultScheduleEntries } from "./data/defaultSchedule";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

app.use("/api/schedule", scheduleRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin", adminRoutes);

let initialized = false;

async function seedScheduleIfEmpty(): Promise<void> {
  const count = await ScheduleEntryModel.countDocuments();

  if (count === 0) {
    await ScheduleEntryModel.insertMany(defaultScheduleEntries);
  }
}

export async function initApp(): Promise<void> {
  if (initialized) {
    return;
  }

  await connectDatabase();
  await seedScheduleIfEmpty();
  initialized = true;
}
