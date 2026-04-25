import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import scheduleRoutes from "./routes/schedule";
import testimonialRoutes from "./routes/testimonials";
import adminRoutes from "./routes/admin";
import { ScheduleEntryModel } from "./models/ScheduleEntry";
import { defaultScheduleEntries } from "./data/defaultSchedule";

const app = express();

// ✅ CORS (allow all)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight
app.options("*", cors());

app.use(express.json());

// ✅ Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

// ✅ Routes
app.use("/api/schedule", scheduleRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Seed function
async function seedScheduleIfEmpty(): Promise<void> {
  const count = await ScheduleEntryModel.countDocuments();
  if (count === 0) {
    await ScheduleEntryModel.insertMany(defaultScheduleEntries);
  }
}

// ✅ Bootstrap for serverless (NO app.listen)
let isConnected = false;

async function init() {
  if (!isConnected) {
    await connectDatabase();
    await seedScheduleIfEmpty();
    isConnected = true;
    console.log("✅ Database connected & seeded");
  }
}

// ✅ Vercel handler
export default async function handler(req: any, res: any) {
  await init();
  return app(req, res);
}