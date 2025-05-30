import { Request, Response } from "express";
import Product from "../models/Product";
import { HttpCode } from "@/utils/constants";

class ProductController {
  // Get all products
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await Product.find();
      res.status(HttpCode.OK).json(products);
    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ 
        message: "Error fetching products", 
        error 
      });
    }
  }

  // Create a new product
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, price, description, stockQuantity } = req.body;
      const imagePath = req.file?.filename;

      if (!imagePath) {
        res.status(HttpCode.BAD_REQUEST).json({ message: "Image is required" });
        return;
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
    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ 
        message: "Error creating product", 
        error 
      });
    }
  }

  // Update a product
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, price, description, stockQuantity } = req.body;
      const updateData: any = { name, price, description, stockQuantity };

      if (req.file) {
        updateData.imagePath = `/uploads/${req.file.filename}`;
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id, 
        updateData, 
        { new: true }
      );

      if (!product) {
        res.status(HttpCode.NOT_FOUND).json({ message: "Product not found" });
        return;
      }

      res.status(HttpCode.OK).json(product);
    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ 
        message: "Error updating product", 
        error 
      });
    }
  }

  // Delete a product
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      
      if (!product) {
        res.status(HttpCode.NOT_FOUND).json({ message: "Product not found" });
        return;
      }

      res.status(HttpCode.OK).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ 
        message: "Error deleting product", 
        error 
      });
    }
  }
}

export default ProductController;