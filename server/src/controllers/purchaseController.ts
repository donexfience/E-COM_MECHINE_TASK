import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { Purchase } from "@/models/Purchase";
dotenv.config();

class PurchaseController {
  async savePurchase(req: Request, res: Response): Promise<void> {
    try {
      const {
        productId,
        productName,
        productPrice,
        productImage,
        paymentIntentId,
        amount,
        currency,
        paymentStatus,
      } = req.body;

      const purchase = new Purchase({
        userId: req.cookies.userId,
        productId,
        productName,
        productPrice,
        productImage,
        paymentIntentId,
        amount,
        currency,
        paymentStatus,
        purchaseDate: new Date(),
      });

      await purchase.save();

      res.status(201).json({
        message: "Purchase saved successfully",
        purchase,
      });
    } catch (error) {
      console.error("Error saving purchase:", error);
      res.status(500).json({ error: "Failed to save purchase" });
    }
  }

  async getAllPurchase(req: Request, res: Response): Promise<void> {
    console.log("get all purchase");
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);

      const purchases = await Purchase.find({ userId: req.cookies.userId })
        .sort({ purchaseDate: -1 })
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber);

      const total = await Purchase.countDocuments({ userId: req.cookies.id });

      res.json({
        purchases,
        totalPages: Math.ceil(total / limitNumber),
        currentPage: pageNumber,
        total,
      });
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      res.status(500).json({ error: "Failed to fetch purchase history" });
    }
  }

  async getPurchaseById(req: Request, res: Response): Promise<void> {
    try {
      const purchase = await Purchase.findOne({
        _id: req.params.purchaseId,
        userId: req.cookies.userId,
      });

      if (!purchase) {
        res.status(404).json({ error: "Purchase not found" });
      }

      res.json(purchase);
    } catch (error) {
      console.error("Error fetching purchase:", error);
      res.status(500).json({ error: "Failed to fetch purchase" });
    }
  }
}

export default PurchaseController;
