import express from "express";
import { adminControllers } from "./admin.controller";
import { verifyToken } from "../../middlewares/verifyToken";
import { profHandlerControllers } from "../professional-service/profservice.controller";

const router = express.Router();

/* -------- AUTH -------- */
router.post("/login", adminControllers.loginAdmin);

//-------Prof Service CRUD--------------//
router.get('/all-prof-services', adminControllers.getAllProfServices);
router.patch(`/service-profile/:id`, profHandlerControllers.updateProfessionalProfile);

/* -------- USERS -------- */
router.get("/users", adminControllers.getAllUsers);
router.patch(`/users/update-details/:id`,adminControllers.editUserDetails);
router.delete(`/users/:id`, adminControllers.deleteUser);

/* -------- RENTS -------- */
router.get("/rents", adminControllers.getAllRents);
router.delete("/rents/:id", adminControllers.deleteRent);

export const adminRoutes = router;
