import { TUser } from "./user.interface";
import User from "./user.model";

// create new user
const createNewUser = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

//edit user details
const updateUserDetails = async (_id: string, payload: TUser) => {
  const result = await User.findByIdAndUpdate(_id, payload, { new: true });
  return result;
};

//get user details
const getUserDetails = async (_id: string) => {
  const result = User.findById(_id).populate("professionalProfiles");
  return result;
};

//get user's id 
const getUserId = async(email:string)=>{
  const result = await User.find({email:email}, {_id:1});
  return result;
}

//update user's OTP
const updateUsersOTP = async (_id: string, OTP: string) => {
  const result = await User.findByIdAndUpdate(_id, { otp: OTP }, { new: true });
  return result;
};

//validate user's OTP
const validateUsersOTP = async (_id: string, OTP: string) => {
  const user = await User.findOne({ _id: _id }, { otp: 1 });
  let result = false;
  if (user) {
    console.log(user.otp);
    console.log(OTP);
    result = user.otp === OTP;
    if (result) {
      await User.findByIdAndUpdate(_id, { otp: "", isVerified: true });
      return result;
    }
  }
  return result;
};

//get the user's total professional services
const getUsersProfessionalServices = async(_id : string) => {
  const result = await User.findById(_id, {professionalProfiles:1}).populate("professionalProfiles");
  return result;
}

export const userServices = {
  createNewUser,
  updateUserDetails,
  getUserId,
  getUserDetails,
  updateUsersOTP,
  validateUsersOTP,
  getUsersProfessionalServices,
};
