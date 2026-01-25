import catchAsync from "../../utils/catchAsync";
import { createToken } from "../../utils/createToken";
import { errorResponse } from "../../utils/errorResponse";
import { generateOTP } from "../../utils/generateOtp";
import { sendOtpToUserEmail } from "../../utils/sendEmailNotification";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

declare module "express-serve-static-core" {
  interface Request {
    realUser?: any;
  }
}

//create new user
const createNewUser = catchAsync(async (req, res) => {
  const payload = req?.body;
  console.log(req?.body);
  const result = await userServices.createNewUser(payload);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User created successfully",
      data: result,
    });
  }
  errorResponse("User registration failed", 400);
});

//update user detials
const editUserDetails = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const payload = req?.body;
  const realUser = req.realUser;
  if (realUser?.userId !== _id) {
    sendResponse(res, {
      success: false,
      statusCode: 403,
      message: "You are not authorized to update this user",
      data: null,
    });
    return;
  }
  const result = await userServices.updateUserDetails(_id, payload);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User details updated successfully",
      data: result,
    });
  }
  errorResponse("User details update failed", 400);
});

//get user details
const getUserDetails = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  console.log(_id);
  const result = await userServices.getUserDetails(_id);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User details fetched successfully",
      data: result,
    });
  }
  errorResponse("Failed to fetch user details", 400);
});

//get user's id
const getUserId = catchAsync(async (req, res) => {
  const email = req?.body?.email;
  const result = await userServices.getUserId(email as string);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User id found",
      data: result,
    });
  }
});

//update user's OTP
const updateUsersOTP = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const OTP = generateOTP(6);
  const result = await userServices.updateUsersOTP(_id, OTP);
  if (result) {
    await sendOtpToUserEmail(result.email, OTP);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "The OTP was sent to the email",
      data: null,
    });
  }
  errorResponse("Failed to send OTP to the email", 500);
});

//validate user's OTP
const validateUsersOTP = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const OTP = req?.body.OTP;
  const result = await userServices.validateUsersOTP(_id, OTP);
  console.log(result);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User verified successfully",
      data: result,
    });
  }
  sendResponse(res, {
    success: false,
    statusCode: 401,
    message: "OTP verificatin failed",
    data: null,
  });
});

//get the user's professional services
const getUsersProfessionalServices = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const result = await userServices.getUsersProfessionalServices(_id as string);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Professional details fetched successfully",
      data: result,
    });
  }
});

//user sign in token generation
const userSignInToken = catchAsync(async (req, res) => {
  const userId = req?.params?.id;
  const token = createToken(
    { userId: userId },
    process.env.JWT_SECRET as string
  );
  if (token) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Token generated successfully",
      data: token,
    });
  } else {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Token generation failed",
      data: null,
    });
  }
});

export const userControllers = {
  createNewUser,
  editUserDetails,
  getUserDetails,
  getUserId,
  updateUsersOTP,
  validateUsersOTP,
  getUsersProfessionalServices,
  userSignInToken,
};
