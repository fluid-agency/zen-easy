import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { errorResponse } from "../../utils/errorResponse";
import { ImageService, MulterFile } from "./image.service";

/* ---------- Property Images ---------- */
const uploadPropertyImages = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as MulterFile[];

  if (!files || files.length === 0) {
    errorResponse("No property images found", 400);
    return;
  }

  const urls = await ImageService.uploadFilesToS3(files, "property_images");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property images uploaded",
    data: { urls },
  });
});

/* ---------- Profile Image ---------- */
const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as MulterFile;

  if (!file) {
    errorResponse("Profile image missing", 400);
    return;
  }

  const url = await ImageService.uploadFileToS3(file, "profile_images");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile image uploaded",
    data: { url },
  });
});

/* ---------- Service Images ---------- */
const uploadServiceImages = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as MulterFile[];

  if (!files || files.length === 0) {
    errorResponse("Service images missing", 400);
    return;
  }

  const urls = await ImageService.uploadFilesToS3(files, "service_images");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Service images uploaded",
    data: { urls },
  });
});

/* ---------- Certificate ---------- */
const uploadCertificate = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as MulterFile;

  if (!file) {
    errorResponse("Certificate file missing", 400);
    return;
  }

  const url = await ImageService.uploadFileToS3(file, "certificates");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Certificate uploaded",
    data: { url },
  });
});

export const imageControllers = {
  uploadPropertyImages,
  uploadProfileImage,
  uploadServiceImages,
  uploadCertificate,
};
