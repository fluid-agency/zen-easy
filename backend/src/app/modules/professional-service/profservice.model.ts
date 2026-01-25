import { Schema, model } from "mongoose";
import { TProfessinalService } from "./profservice.interface";

// TRating Schema
const ratingSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId as any,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// professional service schema
const professionalServiceSchema = new Schema<TProfessinalService>(
  {
    provider: {
      type: Schema.Types.ObjectId as any,
      ref: "User",
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Maid",
        "Home Shifter",
        "Tutor",
        "Electrician",
        "IT Provider",
        "Painter",
        "Plumber",
      ],
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    addressLine: {
      type: String,
      required: true,
    },
    serviceArea: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    minimumPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    maximumPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    availableDays: {
      type: [String],
      required: true,
    },
    availableTime: {
      type: String,
      enum: ["day", "night", "always"],
      required: true,
    },
    coverImage: {
      type: String,
      required: false,
    },
    ratings: {
      type: [ratingSchema],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    certificate: {
      type: String,
      required: true,
    },
    isApproved: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const ProfessionalService = model<TProfessinalService>(
  "ProfessionalService",
  professionalServiceSchema
);
