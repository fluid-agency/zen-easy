import express from "express";
import { userControllers } from "./user.controller";
import { verifyToken } from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/create-new", userControllers.createNewUser);
router.patch(`/update-details/:id`, verifyToken, userControllers.editUserDetails);
router.get(`/find-info/:id`, userControllers.getUserDetails);
router.post("/find-id", userControllers.getUserId);
router.patch(`/generate-otp/:id`, userControllers.updateUsersOTP);
router.post(`/validate-otp/:id`, userControllers.validateUsersOTP);
router.get(
  `/professional-details/:id`,
  userControllers.getUsersProfessionalServices
);
router.post(`/sign-in-token/:id`, userControllers.userSignInToken);

export const userRoutes = router;
