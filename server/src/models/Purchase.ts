import mongoose, { Document, Schema } from "mongoose";

export interface IPurchase extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  productName: string;
  productPrice: number;
  productImage?: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  paymentStatus: "succeeded" | "pending" | "failed";
  purchaseDate: Date;
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "inr",
    },
    paymentStatus: {
      type: String,
      enum: ["succeeded", "pending", "failed"],
      default: "pending",
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

purchaseSchema.index({ userId: 1, purchaseDate: -1 });
purchaseSchema.index({ paymentIntentId: 1 });

export const Purchase = mongoose.model<IPurchase>("Purchase", purchaseSchema);
