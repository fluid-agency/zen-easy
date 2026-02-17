import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminServices } from "./admin.service";
import { errorResponse } from "../../utils/errorResponse";
import { createToken } from "../../utils/createToken";


//------------------Login admin ---------------------//
const loginAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.adminLogin(req.body);
    if (result) {
        const token = createToken(
            { role: "admin" },
            process.env.JWT_SECRET as string
        );
        console.log(token)
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
    }

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

const deleteProfService = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminServices.deleteProfService(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Service deleted successfully",
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
    deleteProfService,
};
