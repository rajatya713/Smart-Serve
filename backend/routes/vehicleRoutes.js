import express from "express";
import {
  createVehicle,
  getVehiclesByAgency,
  getAllVehicles,
} from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Agency only
router.post("/", protect, createVehicle); // Add vehicle
router.get("/agency/:agencyId", getVehiclesByAgency); // Vehicles of one agency
router.get("/", getAllVehicles); // All vehicles

export default router;
