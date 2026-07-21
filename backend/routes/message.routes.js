import express from "express";
import { getChatRooms, getChatHistory } from "../controllers/message.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/rooms", protect, adminOnly, getChatRooms);
router.get("/history/:room", getChatHistory);

export default router;
