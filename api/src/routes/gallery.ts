import { Router } from "express";
import multer from "multer";
import { GalleryItemModel } from "../models/GalleryItem";
import { requireAdmin } from "../utils/adminAuth";
import { deleteCloudinaryMedia, isCloudinaryConfigured, uploadGalleryMediaToCloudinary } from "../utils/cloudinary";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
      cb(new Error("Only image or video files are allowed."));
      return;
    }
    cb(null, true);
  },
});

router.get("/", async (_req, res) => {
  try {
    const items = await GalleryItemModel.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch gallery items.", error });
  }
});

router.post("/", requireAdmin, upload.any(), async (req, res) => {
  try {
    const files = ((req.files as Express.Multer.File[] | undefined) || []).filter(
      (file) => file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")
    );
    if (files.length > 25) {
      return res.status(400).json({ message: "Maximum 25 files are allowed per upload." });
    }
    if (files.length === 0) {
      return res.status(400).json({ message: "media is required." });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        message: "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      });
    }

    const createdItems = [];
    for (const file of files) {
      const mediaType = file.mimetype.startsWith("video/") ? "video" : "image";
      const uploadResult = await uploadGalleryMediaToCloudinary(file.buffer, mediaType, file.originalname);
      const created = await GalleryItemModel.create({
        mediaType,
        mediaUrl: uploadResult.secureUrl,
        cloudinaryPublicId: uploadResult.publicId,
      });
      createdItems.push(created);
    }

    return res.status(201).json(createdItems);
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload gallery media.", error });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryItemModel.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    if (isCloudinaryConfigured()) {
      await deleteCloudinaryMedia(item.cloudinaryPublicId, item.mediaType);
    }

    await GalleryItemModel.findByIdAndDelete(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete gallery item.", error });
  }
});

export default router;
