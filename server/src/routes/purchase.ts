import PurchaseController from "@/controllers/purchaseController";
import UserController from "@/controllers/userController";
import authMiddlewareForInterceptor from "@/middleware/authMIddlewareForInterceptor";
import express from "express";

const router = express.Router();
const purchaseController = new PurchaseController();
router.get(
  "/:purchaseId",
  purchaseController.getPurchaseById.bind(purchaseController)
);
router.get(
  "/all/history",
  authMiddlewareForInterceptor,
  purchaseController.getAllPurchase.bind(purchaseController)
);
router.post("/save",authMiddlewareForInterceptor, purchaseController.savePurchase.bind(purchaseController));

export default router;
