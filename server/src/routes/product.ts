import express from "express";
import authMiddleware from "@/middleware/authMiddleware";
import upload from "@/utils/multer";
import ProductController from "@/controllers/productController";
import authMiddlewareForInterceptor from "@/middleware/authMIddlewareForInterceptor";

const router = express.Router();
const productController = new ProductController();

router.get(
  "/",
  authMiddleware,
  productController.getAllProducts.bind(productController)
);
router.get(
  "/single/:id",
  productController.getProductById.bind(productController)
);

router.post(
  "/",
  authMiddlewareForInterceptor,
  (req, res, next) => {
    upload.single("productImage")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  productController.createProduct.bind(productController)
);
router.put(
  "/:id",
  authMiddlewareForInterceptor,
  upload.single("productImage"),
  productController.updateProduct.bind(productController)
);

router.delete(
  "/:id",
  authMiddlewareForInterceptor,
  productController.deleteProduct.bind(productController)
);

export default router;
