import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TProfessinalService, TRating } from "./profservice.interface";
import { professionHandlerService } from "./profservice.service";

//create new user service profile
const createNewServiceProfile = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const payload = req?.body;
  const result = await professionHandlerService.createNewService(
    _id as string,
    payload as TProfessinalService
  );
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "new service profile created",
      data: result,
    });
    return;
  }

  sendResponse(res, {
    success: false,
    statusCode: 500,
    message: "Service profile creation failed",
    data: null,
  });
  return;
});

//get user's professional profiles
const getUsersProfessionalProfiles = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const result = await professionHandlerService.getUserProfessionalProfiles(
    _id as string
  );
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User's professional profiles fetched successfully",
      data: result,
    });
    return;
  }
  sendResponse(res, {
    success: false,
    statusCode: 404,
    message: "Failed to fetch service profile",
    data: null,
  });
  return;
});

//update professional profile
const updateProfessionalProfile = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const payload = req?.body;
  const result = await professionHandlerService.updateProfessionalProfile(
    _id,
    payload
  );
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User's professional profile updated successfully",
      data: result,
    });
    return;
  }
  sendResponse(res, {
    success: false,
    statusCode: 500,
    message: "Failed to update user's professional profile",
    data: null,
  });
  return;
});

//find services
const findServices = catchAsync(async (req, res) => {
  const category = req?.params?.category;
  const result = await professionHandlerService.findServices(
    category as string
  );
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Services found",
      data: result,
    });
    return;
  }
  sendResponse(res, {
    success: false,
    statusCode: 404,
    message: "Failed to find services",
    data: null,
  });
  return;
});

//find a service
const findServiceById = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const result = await professionHandlerService.findServiceById(_id as string);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Service found",
      data: result,
    });
    return;
  }
  sendResponse(res, {
    success: false,
    statusCode: 404,
    message: "Failed to find service details",
    data: null,
  });
  return;
});

//const add new feedback
const addNewFeedback = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const payload = req?.body;
  const result = await professionHandlerService.addNewFeedback(
    _id as string,
    payload as TRating
  );
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Feedback added successfully",
      data: result,
    });
    return;
  }
  sendResponse(res, {
    success: false,
    statusCode: 500,
    message: "Failed to add feedback",
    data: null,
  });
  return;
});

export const profHandlerControllers = {
  createNewServiceProfile,
  updateProfessionalProfile,
  getUsersProfessionalProfiles,
  findServices,
  findServiceById,
  addNewFeedback,
};
