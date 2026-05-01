import { Router } from "express";
import multer from "multer";
import { TestimonialModel } from "../models/Testimonial";
import { isAdminRequest, requireAdmin } from "../utils/adminAuth";
import { isCloudinaryConfigured, uploadProfileImageToCloudinary } from "../utils/cloudinary";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed."));
      return;
    }
    cb(null, true);
  },
});

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

router.post("/", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, role, message } = req.body;

    if (!name || !role || !message) {
      return res.status(400).json({ message: "name, role and message are required." });
    }

    let profileImageUrl: string | null = null;
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return res.status(500).json({
          message: "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        });
      }

      profileImageUrl = await uploadProfileImageToCloudinary(req.file.buffer, req.file.originalname);
    }

    const created = await TestimonialModel.create({ name, role, message, profileImageUrl, status: "pending" });
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
