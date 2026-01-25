import express from "express";
import { rentController } from "./rent.controller";
const router = express.Router();

router.get('/rent-posts', rentController.fetchAllRentPosts);
router.post('/create', rentController.createNewRentAd);
router.patch(`/update/:id`, rentController.updateRentPostDetails);
router.patch(`/update-status/:id`, rentController.updateRentPostStatus);
router.get(`/view-details/:id` , rentController.getRentDetails);
router.delete(`/delete/:id`, rentController.deleteRentPost);

export const rentRoutes = router;