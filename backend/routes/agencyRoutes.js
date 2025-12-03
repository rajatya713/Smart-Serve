import express from "express";
import {
  createAgency,
  getAllAgencies,
  getAgencyById,
} from "../controllers/agencyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin or agency only
router.post("/", protect, createAgency); // Create agency
router.get("/", getAllAgencies); // Get all agencies
router.get("/:id", getAgencyById); // Get single agency

export default router;
