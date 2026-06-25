// import express from "express";
// import {
//   getProducts,
//   addProduct,
//   updateProduct,
//   deleteProduct,
// } from "../controllers/product.controller.js";
// import { protect, adminOnly } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.route("/")
//   .get(getProducts)
//   .post(protect, adminOnly, addProduct);

// router.route("/:id")
//   .put(protect, adminOnly, updateProduct)
//   .delete(protect, adminOnly, deleteProduct);

// export default router;

import express from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { uploadProductImages } from "../controllers/avater.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, adminOnly, addProduct);

router.get("/:id", getProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

router.post("/upload-images", upload.array("images", 5), uploadProductImages);

export default router;
