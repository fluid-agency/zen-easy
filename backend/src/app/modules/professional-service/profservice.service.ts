import { get } from "http";
import User from "../user/user.model";
import { TProfessinalService, TRating } from "./profservice.interface";
import { ProfessionalService } from "./profservice.model";

// create a new user service
const createNewService = async (_id: string, payload: TProfessinalService) => {
  const result = await ProfessionalService.create(payload);
  if (result?._id) {
    const finalResult = await User.findByIdAndUpdate(
      _id,
      { $push: { professionalProfiles: result._id } },
      { new: true }
    );
    return finalResult;
  }
};

//get user's professional profiles details
const getUserProfessionalProfiles = async (_id: string) => {
  const result = await ProfessionalService.findById(_id);
  return result;
};

//update professional profile
const updateProfessionalProfile = async (
  _id: string,
  payload: TProfessinalService
) => {
  const result = await ProfessionalService.findByIdAndUpdate(_id, payload, {
    new: true,
  });
  return result;
};

//add new feedback
const addNewFeedback = async (_id: string, payload: TRating) => {
  const result = await ProfessionalService.findByIdAndUpdate(_id, {
    $push: { ratings: payload },
  });
  return result;
};

//find services
const findServices = async (category: string) => {
  const result = await ProfessionalService.find({
    category: category,
  }).populate("provider").populate("ratings.client", "name _id");
  return result;
};

//find a service
const findServiceById = async (_id: string) => {
  const result = ProfessionalService.findById(_id);
  return result;
};
export const professionHandlerService = {
  createNewService,
  getUserProfessionalProfiles,
  updateProfessionalProfile,
  findServices,
  findServiceById,
  addNewFeedback,
};
