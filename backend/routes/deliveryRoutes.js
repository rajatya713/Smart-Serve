import express from "express";
import {
  getMyDeliveries,
  updateLocation,
  getTrackingInfo,
  pickupVehicle,
  startTransit,
  completeDelivery,
  getAvailableAgents,
} from "../controllers/deliveryController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, authorize("delivery"), getMyDeliveries);
router.post("/update-location", protect, authorize("delivery"), updateLocation);
router.post("/pickup", protect, authorize("delivery"), pickupVehicle);
router.post("/start-transit", protect, authorize("delivery"), startTransit);
router.post("/complete", protect, authorize("delivery"), completeDelivery);
router.get(
  "/agents",
  protect,
  authorize("agency", "admin"),
  getAvailableAgents,
);
router.get("/track/:bookingId", protect, getTrackingInfo);

export default router;
