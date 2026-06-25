// routes/userRoutes.js
import express from "express";
import upload from "../middleware/upload.middleware.js";

import {
  avatercontroller,
  uploadProductImages,
} from "../controllers/avater.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// routes/user.routes.js

router.post("/upload-avatar/:id", upload.single("avatar"), avatercontroller);

export default router;
