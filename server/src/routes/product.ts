import express, { Request, Response } from "express";
import path from "path";
import Product from "../models/Product";
import authMiddleware from "@/middleware/authMiddleware";
import upload from "@/utils/multer";
import { HttpCode } from "@/utils/constants";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const products = await Product.find();
  res.status(HttpCode.OK).json(products);
});

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    const { name, price, description, stockQuantity } = req.body;
    const imagePath = req.file?.filename;

    if (!imagePath) {
      res.status(400).json({ message: "Image is required" });
    }

    const product = new Product({
      name,
      price,
      description,
      imagePath: `/uploads/${imagePath}`,
      stockQuantity,
    });

    await product.save();
    res.status(HttpCode.CREATED).json(product);
  }
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const { name, price, description, stockQuantity } = req.body;
    const updateData: any = { name, price, description, stockQuantity };

    if (req.file) {
      updateData.imagePath = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(HttpCode.OK).json(product);
  }
);

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(HttpCode.OK).json({ message: "Product deleted" });
});

export default router;
