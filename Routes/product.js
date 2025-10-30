import express from "express";
import upload from "../middlewares/cloudinaryMulterUpload.js";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,imageUpload
} from "../Controllers/product.js";


const router = express.Router();

router.post("/create-product",  createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.post('/upload-image/',upload.single("img"),imageUpload)
router.put("/:id",  updateProduct);
router.delete("/:id",  deleteProduct);

export default router;
