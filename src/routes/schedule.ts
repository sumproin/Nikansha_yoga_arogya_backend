import { Router } from "express";
import { ScheduleEntryModel } from "../models/ScheduleEntry";
import { DAYS } from "../models/constants";
import { requireAdmin } from "../utils/adminAuth";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const entries = await ScheduleEntryModel.find().sort({ createdAt: 1 });
    return res.json(entries);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch schedule.", error });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { day, time, className, instructor, room, level, color } = req.body;

    if (!DAYS.includes(day)) {
      return res.status(400).json({ message: "Invalid day." });
    }

    if (!time || !className || !instructor || !room) {
      return res.status(400).json({ message: "day, time, className, instructor and room are required." });
    }

    const created = await ScheduleEntryModel.create({
      day,
      time,
      className,
      instructor,
      room,
      level: level || "All Levels",
      color: color || "border-l-teal",
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create schedule entry.", error });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { day, time, className, instructor, room, level, color } = req.body;

    if (day && !DAYS.includes(day)) {
      return res.status(400).json({ message: "Invalid day." });
    }

    const updated = await ScheduleEntryModel.findByIdAndUpdate(
      id,
      {
        ...(day ? { day } : {}),
        ...(time ? { time } : {}),
        ...(className ? { className } : {}),
        ...(instructor ? { instructor } : {}),
        ...(room ? { room } : {}),
        ...(level ? { level } : {}),
        ...(color ? { color } : {}),
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.status(404).json({ message: "Schedule entry not found." });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update schedule entry.", error });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ScheduleEntryModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Schedule entry not found." });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete schedule entry.", error });
  }
});

export default router;
