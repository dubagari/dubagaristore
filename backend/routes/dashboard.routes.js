import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getDashboardStats);

export default router;
