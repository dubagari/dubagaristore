import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrders,
  markOrderAsPaid,
  updateOrderStatus,
  verifyPaystackPayment,
} from "../controllers/order.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/", protect, adminOnly, getOrders);

router.put("/:id/status", protect, adminOnly, updateOrderStatus);

// router.put("/:id/pay", protect, verifyPaystackPayment);

router.put("/:id/pay", protect, markOrderAsPaid);

export default router;
