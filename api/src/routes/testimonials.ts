import { Router } from "express";
import { TestimonialModel } from "../models/Testimonial";
import { isAdminRequest, requireAdmin } from "../utils/adminAuth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const includePending = req.query.includePending === "true";
    const isAdmin = isAdminRequest(req);

    const query = includePending && isAdmin ? {} : { status: "approved" };
    const testimonials = await TestimonialModel.find(query).sort({ createdAt: -1 });
    return res.json(testimonials);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch testimonials.", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, role, message } = req.body;

    if (!name || !role || !message) {
      return res.status(400).json({ message: "name, role and message are required." });
    }

    const created = await TestimonialModel.create({ name, role, message, status: "pending" });
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create testimonial.", error });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be approved or rejected." });
    }

    const updated = await TestimonialModel.findByIdAndUpdate(
      id,
      {
        status,
        approvedAt: status === "approved" ? new Date() : null,
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update testimonial status.", error });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TestimonialModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete testimonial.", error });
  }
});

export default router;
