import express from "express";
import {
  createBooking,
  getBookingsByUser,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking); // Create booking
router.get("/user", protect, getBookingsByUser); // Get user's bookings

export default router;
