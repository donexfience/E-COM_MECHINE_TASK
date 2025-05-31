import PaymentController from "@/controllers/paymentController";
import authMiddlewareForInterceptor from "@/middleware/authMIddlewareForInterceptor";
import express from "express";

const router = express.Router();
const paymentController = new PaymentController();

router.post("/create-intent", authMiddlewareForInterceptor, (req, res) =>
  paymentController.createIntent(req, res)
);

// Using express.raw middleware ONLY on webhook route to get raw body for Stripe signature verification
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   (req, res) => paymentController.handleWebhook(req, res)
// );

export default router;
