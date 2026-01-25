import { model, Schema, Types } from "mongoose";
import { TRent } from "./rent.interface";

const RentSchema: Schema = new Schema<TRent>(
  {
    category: {
      type: String,
      enum: [
        "bachelor room",
        "family room",
        "flat",
        "store",
        "office",
        "shopping mall",
      ],
      required: true,
    },
    rentStartDate: {
      type: Date,
      required: true,
    },
    imageUrls:{
        type:[String],
        required:false,
    },
    rentPaymentFrequency: {
      type: String,
      enum: ["daily", "monthly", "quarterly", "annually"],
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    addressLine: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Booked"],
      required: false,
      default: "Active",
    },
    user:{
      type:Schema.Types.ObjectId,
      ref:"User",
      trim:true,
      required:true,
    }
  },
  {
    timestamps: true,
  }
);

const Rent = model<TRent>("Rent", RentSchema);
export default Rent;
