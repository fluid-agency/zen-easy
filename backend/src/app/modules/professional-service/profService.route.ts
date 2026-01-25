import express from "express";
import { profHandlerControllers } from "./profservice.controller";
const router = express.Router();

router.post(`/create-profile/:id`, profHandlerControllers.createNewServiceProfile);
router.get(`/view-profile/:id`, profHandlerControllers.getUsersProfessionalProfiles);
router.patch(`/update-profile/:id`, profHandlerControllers.updateProfessionalProfile);
router.get(`/find-services/:category` , profHandlerControllers.findServices);
router.get(`/view-details/:id`, profHandlerControllers.findServiceById);
router.post(`/add-feedback/:id`, profHandlerControllers.addNewFeedback);

export const profHandleRoutes = router;