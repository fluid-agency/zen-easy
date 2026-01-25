import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminServices } from "./admin.service";
import { errorResponse } from "../../utils/errorResponse";


//------------------Login admin ---------------------//
const loginAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.adminLogin(req.body);
     
    if(!result){
        sendResponse(res,{
            statusCode:httpStatus.UNAUTHORIZED,
            success:false,
            message:"Invalid Credentials",
            data:result
        })
    }
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin logged in successfully",
        data: result,
    });
});


//-----------------Prof service crud-------------//
const getAllProfServices = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.getAllProfServices();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Services retrieved successfully",
        data: result,
    });
});

/* ---------------- USER ---------------- */

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
});

const editUserDetails = catchAsync(async (req, res) => {
  const _id = req?.params?.id;
  const payload = req?.body;

  const result = await adminServices.updateUserDetails(_id, payload);
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


const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminServices.deleteUser(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});

/* ---------------- RENT ---------------- */

const getAllRents = catchAsync(async (_req: Request, res: Response) => {
    const result = await adminServices.getAllRents();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rents retrieved successfully",
        data: result,
    });
});

const deleteRent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminServices.deleteRent(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rent deleted successfully",
        data: result,
    });
});

export const adminControllers = {
    loginAdmin,
    getAllProfServices,
    getAllUsers,
    editUserDetails,
    deleteUser,
    getAllRents,
    deleteRent,
};
