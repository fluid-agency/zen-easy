import express from "express";
import { adminControllers } from "./admin.controller";
import { verifyAdminToken, verifyToken } from "../../middlewares/verifyToken";
import { profHandlerControllers } from "../professional-service/profservice.controller";

const router = express.Router();

/* -------- AUTH -------- */
router.post("/login", adminControllers.loginAdmin);

//-------Prof Service CRUD--------------//
router.get('/all-prof-services', verifyAdminToken, adminControllers.getAllProfServices);
router.patch(`/service-profile/:id`, verifyAdminToken, profHandlerControllers.updateProfessionalProfile);
router.delete(`/service-profile/:id`, verifyAdminToken, adminControllers.deleteProfService);

/* -------- USERS -------- */
router.get("/users", verifyAdminToken, adminControllers.getAllUsers);
router.patch(`/users/update-details/:id`,adminControllers.editUserDetails);
router.delete(`/users/:id`, adminControllers.deleteUser);

/* -------- RENTS -------- */
router.get("/rents", adminControllers.getAllRents);
router.delete("/rents/:id", adminControllers.deleteRent);

export const adminRoutes = router;
