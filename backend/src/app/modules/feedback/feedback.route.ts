import express from "express";
import { feedbackController } from "./feedback.controller";
const router = express.Router();


router.get('/', feedbackController.fetchAllFeedbacks);
router.post('/create', feedbackController.createNewFeedback);

export const feedbackRoutes = router;