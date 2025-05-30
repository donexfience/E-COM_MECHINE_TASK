import express from "express";
import authMiddleware from "@/middleware/authMiddleware";
import upload from "@/utils/multer";
import ProductController from "@/controllers/productController";

const router = express.Router();
const productController = new ProductController();

router.get("/", productController.getAllProducts.bind(productController));

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  productController.createProduct.bind(productController)
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  productController.updateProduct.bind(productController)
);

router.delete(
  "/:id",
  authMiddleware,
  productController.deleteProduct.bind(productController)
);

export default router;
