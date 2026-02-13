import catchAsync from "../../utils/catchAsync";
import { errorResponse } from "../../utils/errorResponse";
import sendResponse from "../../utils/sendResponse";
import { rentServices } from "./rent.service";
import { Request, Response } from "express";

//fetch all rent posts
const fetchAllRentPosts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await rentServices.getRentPosts();
    if (result) {
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rent posts fetched successfully",
        data: result,
      });
      return;
    }
    else{
      sendResponse(res,{
        success:false,
        statusCode:404,
        message:"Data not found",
        data:null,
      })
      return;
    }
  }
);


//create a rent ad
const createNewRentAd = catchAsync(
  async (req: Request, res: Response) => {
    const result = await rentServices.createRentAd(req?.body);
    if (result) {
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rent post created successfully",
        data: result,
      });
      return;
    }
    else {
      sendResponse(res,{
        success:false,
        statusCode:400,
        message:"Post creation failed",
        data:null,
      })
      return;
    }
  }
);

//update rent post status 
const updateRentPostStatus = catchAsync(async(req,res)=>{
  const result = await rentServices.updateRentAdStatus(req?.params?.id, req?.body?.status);
  if(result){
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rent post's status has changed",
        data: result,
      });
      return;
  }
  else {
    sendResponse(res,{
      success:false,
      statusCode:400,
      message:"Failed to update the status of rent ad",
      data:null,
    })
    return;
  }
})

//update rent post details 
const updateRentPostDetails = catchAsync(async(req,res)=>{
  const result = await rentServices.updateRentAd(req?.params?.id, req?.body?.rentPostData);
  if(result){
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rent post updated successfully",
        data: result,
      });
      return;
  }
  else {
    sendResponse(res,{
      success:false,
      statusCode:400,
      message:"Failed to update the rent ad",
      data:null,
    })
    return;
  }
})

//view a rent details
const getRentDetails = catchAsync(async(req,res)=>{
  const _id = req?.params?.id;
  const result = await rentServices.viewRentDeails(_id as string);
  if(result){
    sendResponse(res,{
      success:true,
      statusCode:200,
      message:"Rent details fetched successfully",
      data:result,
    })
    return;
  }
  else{
    sendResponse(res,{
      success:false,
      statusCode:404,
      message:"Failed to fetch rent post details",
      data:null,
    })
    return;
  }
})

//delete a rent post
const deleteRentPost = catchAsync(async(req,res)=>{
  const id = req?.params?.id;
  if(id){
    const result = await rentServices.deleteRent(id as string);
    sendResponse(res,{
      success:true,
      statusCode:200,
      message:"Post deleted successfully",
      data:result
    })

  }
})

export const rentController = {
    fetchAllRentPosts,
    createNewRentAd,
    updateRentPostStatus,
    updateRentPostDetails,
    getRentDetails,
    deleteRentPost,
}