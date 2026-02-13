import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { feedbackServices } from "./feedback.service";
import { Request, Response } from "express";



//fetch all feedbacks
const fetchAllFeedbacks = catchAsync(
    async (req: Request, res: Response) => {
        const result = await feedbackServices.getAllFeedback();
        if (result) {
            sendResponse(res, {
                success: true,
                statusCode: 200,
                message: "Feedbacks fetched successfully",
                data: result,
            });
            return;
        }
        else {
            sendResponse(res, {
                success: false,
                statusCode: 404,
                message: "Data not found",
                data: null,
            })
            return;
        }
    }
)

//create feedback
const createNewFeedback = catchAsync(
    async (req: Request, res: Response) => {
        const result = await feedbackServices.createFeedback(req?.body);
        if (result) {
            sendResponse(res, {
                success: true,
                statusCode: 200,
                message: "Feedback created successfully",
                data: result,
            });
            return;
        }
        else {
            sendResponse(res, {
                success: false,
                statusCode: 400,
                message: "Feedback creation failed",
                data: null,
            })
            return;
        }
    }
)


export const feedbackController = {
    fetchAllFeedbacks,
    createNewFeedback
}