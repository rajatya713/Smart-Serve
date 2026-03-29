import express from "express";
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByAgency,
  getMyVehicles,
  getVehicleById,
  getAllVehicles,
} from "../controllers/vehicleController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllVehicles);
router.get("/my", protect, authorize("agency"), getMyVehicles);
router.get("/agency/:agencyId", getVehiclesByAgency);
router.get("/:id", getVehicleById);
router.post("/", protect, authorize("agency"), createVehicle);
router.put("/:id", protect, authorize("agency"), updateVehicle);
router.delete("/:id", protect, authorize("agency"), deleteVehicle);

export default router;
