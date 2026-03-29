import express from "express";
import {
  createBooking,
  getBookingsByUser,
  getBookingById,
  cancelBooking,
  assignDeliveryAgent,
  getAllBookings,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/user", protect, getBookingsByUser);
router.get("/all", protect, authorize("admin"), getAllBookings);
router.get("/:id", protect, getBookingById);
router.patch("/:id/cancel", protect, cancelBooking);
router.post("/assign-agent", protect, authorize("agency"), assignDeliveryAgent);

export default router;
