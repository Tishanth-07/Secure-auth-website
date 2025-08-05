import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/admin/stats - Admin Dashboard Stats
router.get("/stats", protect, adminOnly, getAdminStats);

export default router;
