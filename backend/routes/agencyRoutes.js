import express from "express";
import {
  createAgency,
  getMyAgency,
  updateAgency,
  getAllAgencies,
  getAgencyById,
  getAgencyStats,
  getAgencyBookings,
} from "../controllers/agencyController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllAgencies);
router.get("/me", protect, authorize("agency"), getMyAgency);
router.get("/stats", protect, authorize("agency"), getAgencyStats);
router.get("/bookings", protect, authorize("agency"), getAgencyBookings);
router.post("/", protect, authorize("agency"), createAgency);
router.put("/me", protect, authorize("agency"), updateAgency);
router.get("/:id", getAgencyById);

export default router;
