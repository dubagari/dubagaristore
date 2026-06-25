import express from "express";
import {
  createPaymentIntent,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/initialize", protect, createPaymentIntent);
router.post("/verify", protect, verifyPayment);

export default router;
