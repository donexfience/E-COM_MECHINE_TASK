import { Request, Response } from "express";
import Product from "../models/Product";
import { HttpCode } from "@/utils/constants";

class ProductController {
  // Get all products
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const {
        search = "",
        minPrice,
        maxPrice,
        startDate,
        endDate,
        page = "1",
        limit = "10",
      } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
      const skip = (pageNumber - 1) * pageSize;

      const filter: any = {};

      if (search) {
        filter.name = { $regex: search as string, $options: "i" };
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
      }

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate as string);
        if (endDate) filter.createdAt.$lte = new Date(endDate as string);
      }

      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter).skip(skip).limit(pageSize);

      res.status(200).json({
        total,
        page: pageNumber,
        pageSize,
        products,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching products",
        error,
      });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      if (!productId) {
        res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "product Id is requried" });
      }
      const product = await Product.findById(productId);
      if (!product) {
        res.status(HttpCode.BAD_REQUEST).json({ message: "product not found" });
      }
      res.status(HttpCode.OK).json(product);
    } catch (error) {
      console.error(error);
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        message: "Error getting  product",
        error,
      });
    }
  }

  // Create a new product
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, price, description, stockQuantity } = req.body;
      console.log(req.file, "fiele in the createproduct");
      const imagePath = req.file?.filename;
      console.log(imagePath, "image path");
      const existingProduct = await Product.findOne({ name: name });
      if (existingProduct) {
        res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "Product with this name already exist" });
      }
      if (!imagePath) {
        res.status(HttpCode.BAD_REQUEST).json({ message: "Image is required" });
        return;
      }

      const product = new Product({
        name,
        price,
        description,
        imageURL: `/uploads/${imagePath}`,
        stockQuantity,
      });

      await product.save();
      res.status(HttpCode.CREATED).json(product);
    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        message: "Error creating product",
        error,
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
        error,
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
        error,
      });
    }
  }
}

export default ProductController;
