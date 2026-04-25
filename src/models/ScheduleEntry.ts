import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { DAYS } from "./constants";

const scheduleEntrySchema = new Schema(
  {
    day: {
      type: String,
      enum: DAYS,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    room: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      trim: true,
      default: "All Levels",
    },
    color: {
      type: String,
      required: true,
      trim: true,
      default: "border-l-teal",
    },
  },
  {
    timestamps: true,
  }
);

export type ScheduleEntry = InferSchemaType<typeof scheduleEntrySchema>;

export const ScheduleEntryModel =
  mongoose.models.ScheduleEntry ||
  mongoose.model("ScheduleEntry", scheduleEntrySchema);
