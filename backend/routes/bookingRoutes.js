import express from "express";
import {
  createBooking,
  getBookingsByUser,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/user", protect, getBookingsByUser);
router.patch("/:id/cancel", protect, cancelBooking);

export default router;
