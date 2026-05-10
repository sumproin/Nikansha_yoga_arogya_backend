import mongoose, { Schema, type InferSchemaType } from "mongoose";

const galleryItemSchema = new Schema(
  {
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export type GalleryItem = InferSchemaType<typeof galleryItemSchema>;

export const GalleryItemModel =
  mongoose.models.GalleryItem || mongoose.model("GalleryItem", galleryItemSchema);
