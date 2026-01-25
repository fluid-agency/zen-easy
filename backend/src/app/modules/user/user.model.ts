import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

const SocialMediaSchema = new Schema(
  {
    facebook: {
      type: String,
      required: false,
      trim: true,
    },
    instagram: {
      type: String,
      required: false,
      trim: true,
    },
    linkedin: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { _id: false }
);

const AddressSchema = new Schema({
  street:{
    type:String,
    trim:true,
    required:true,
  },
  city:{
    type:String,
    trim:true,
    required:true,
  },
  postalCode:{
    type:String,
    trim:true,
    required:true,
  },
})
const RentSchema: Schema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      required: false,
      trim: true,
    },
    nid: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: AddressSchema,
    },
    phoneNumber:{
      type:String,
      required:true,
      trim:true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
      trim: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    occupation: {
      type: String,
      required: false,
      trim: true,
    },
    professionalProfiles: {
      type: [Schema.Types.ObjectId],
      ref:'ProfessionalService',
      required: false,
    },
    socialMedia: {
      type: SocialMediaSchema,
      required: false,
    },
    otp: {
      type: String,
      default: "",
      required: false,
    },
    isVerified:{
        type:Boolean,
        default:false,
        required:false,
    },
    status:{
      type:String,
      enum:["active" , "inactive"],
      required:false,
      default:"active",
    },
  },
  {
    timestamps: true,
  }
);

const User = model<TUser>("User", RentSchema);
export default User;
