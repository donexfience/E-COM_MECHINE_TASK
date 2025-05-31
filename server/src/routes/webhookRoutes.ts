import PaymentController from "@/controllers/paymentController";
import express from "express";

const router = express.Router();
const paymentController = new PaymentController();

router.post("/", express.raw({ type: "application/json" }), (req, res) =>
  paymentController.handleWebhook(req, res)
);

export default router;
