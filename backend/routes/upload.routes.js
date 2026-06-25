import express from "express";
import upload from "../middleware/upload.middleware.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  res.json({
    success: true,
    imageUrl: req.file.path,
  });
});

export default router;
