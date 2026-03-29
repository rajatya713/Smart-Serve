import express from "express";
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllAgenciesAdmin,
  updateAgencyStatus,
  deleteAgency,
  getAllBookingsAdmin,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.put("/users/role", protect, authorize("admin"), updateUserRole);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);
router.get("/agencies", protect, authorize("admin"), getAllAgenciesAdmin);
router.put("/agencies/status", protect, authorize("admin"), updateAgencyStatus);
router.delete("/agencies/:id", protect, authorize("admin"), deleteAgency);
router.get("/bookings", protect, authorize("admin"), getAllBookingsAdmin);

export default router;
